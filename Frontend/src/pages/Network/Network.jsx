import styles from "./Network.module.css";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Button from "../../components/shared-components/Buttons/Button";
import UserInfo from "../../components/shared-components/User/UserInfo";
import useUserStore from "../../stores/User";
import useNetworkStore from "../../stores/Network";

export default function Network() {
  const { type } = useParams();
  const network = useNetworkStore((s) => s.network);
  const getNetwork = useNetworkStore((s) => s.getNetwork);
  const handleRemove = useNetworkStore((s) => s.handleRemove);
  const currUserId = useUserStore((state) => state.currUserId);

  useEffect(() => {
    getNetwork(type, currUserId);
  }, [type]);

  return (
    <div className={styles.networkCard}>
      <div className={styles.networkHeader}>
        {type === "followers"
          ? "Your Followers"
          : type === "following"
            ? "People You Follow"
            : type === "connections"
              ? "My connections"
              : null}
      </div>

      <div className={styles.networkCardBody}>
        {network.length === 0 ? (
          <div className={styles.fallBackUI}>
            {type === "followers"
              ? "Oops! Looks like you don't have any followers!"
              : type === "following"
                ? "Oops! Looks like you aren't following anybody!"
                : type === "connections"
                  ? "Oops! You have no connections. Start connecting today!"
                  : null}
          </div>
        ) : (
          network?.map((n) => {
            const user =
              type === "followers"
                ? n.user
                : type === "following"
                  ? n.userFollowed
                  : type === "connections" //We're trying to find the other person from connections data here.
                    ? currUserId === n.user._id
                      ? n.connectedUser
                      : n.user
                    : null;

            if (!user || !user.profile) return null; // Handle edge case

            return (
              <div className={styles.networkItem} key={n._id}>
                <UserInfo
                  url={user.profile.profileImage?.url}
                  headline={user.profile.headline}
                  username={user.profile.name}
                  profileId={user?.profile._id}
                  avatarStyles={{ height: "3rem", width: "3rem" }}
                />
                <Button
                  variant="sm"
                  btnText={type === "following" ? "Unfollow" : "Remove"}
                  onClick={() => handleRemove(type, user._id)}
                />
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
