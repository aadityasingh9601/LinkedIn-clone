import mongoose from "mongoose";

class GridFsStorage {
  constructor(opts = {}) {
    this.fileFn = opts.file;
  }

  _handleFile(req, file, cb) {
    const db = mongoose.connection.db;
    if (!db) {
      return cb(new Error("Database not connected"));
    }

    Promise.resolve(this.fileFn ? this.fileFn(req, file) : {})
      .then((fileInfo) => {
        const bucketName = fileInfo?.bucketName || "uploads";
        const filename = fileInfo?.filename || file.originalname;

        const bucket = new mongoose.mongo.GridFSBucket(db, { bucketName });
        const uploadStream = bucket.openUploadStream(filename, {
          contentType: file.mimetype,
        });

        file.stream
          .pipe(uploadStream)
          .on("error", (err) => cb(err))
          .on("finish", function () {
            const f = this.gridFSFile;
            cb(null, {
              id: f._id,
              filename: f.filename,
              metadata: f.metadata || null,
              bucketName,
              chunkSize: f.chunkSize,
              size: f.length,
              md5: f.md5,
              uploadDate: f.uploadDate,
              contentType: f.contentType,
            });
          });
      })
      .catch((err) => cb(err));
  }

  _removeFile(req, file, cb) {
    const db = mongoose.connection.db;
    if (!db) {
      return cb(new Error("Database not connected"));
    }

    const bucket = new mongoose.mongo.GridFSBucket(db, {
      bucketName: file.bucketName || "uploads",
    });

    bucket.delete(file.id).then(() => cb(null)).catch((err) => cb(err));
  }
}

export default GridFsStorage;
