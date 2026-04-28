import "./PollForm.css";
import Button from "../Button.";
import { useForm, useFieldArray } from "react-hook-form";
import { useState } from "react";
import usePollStore from "../../stores/Poll";
import RHFtextarea from "../RHFtextarea";
import { PollDataSchema } from "../../../../common/src";
import { zodResolver } from "@hookform/resolvers/zod";

export default function PollForm() {
  const setPoll = usePollStore((state) => state.setPoll);
  const createPoll = usePollStore((state) => state.createPoll);

  const {
    register,
    handleSubmit,
    control,
    reset, //This method is used to clear up the form fields after the form has been submitted.
    formState: { errors },
  } = useForm({
    resolver: zodResolver(PollDataSchema),
    defaultValues: {
      options: [{ value: "" }, { value: "" }, { value: "" }, { value: "" }], // Default empty options
    },
  });

  const { fields } = useFieldArray({
    control,
    name: "options", // Register options as an array
  });

  const [pollDuration, setpollDuration] = useState("1");

  const onSubmit = (data) => {
    const pollData = {
      options: data.options,
      question: data.question,
      pollDuration: pollDuration,
    };
    console.log(pollData);
    createPoll(pollData);
  };

  return (
    <div className="pollform">
      <div className="head">
        <span>Create a poll</span>
      </div>
      <div className="mid">
        <form id="myForm" onSubmit={handleSubmit(onSubmit)}>
          <span>
            Your question<span style={{ color: "red" }}>*</span>
          </span>
          <RHFtextarea
            placeholder="Eg. How do you commute to work?"
            name="question"
            register={register}
            errors={errors}
          />

          {fields.map((field, index) => (
            <div key={field.id}>
              <span>
                Option {index + 1}
                <span style={{ color: "red" }}>*</span>
              </span>

              <input
                name="options"
                placeholder="Eg. Public transport"
                {...register(`options.${index}.value`, {
                  required: "This is an required field.",
                })}
              />
            </div>
          ))}
          <span>Poll duration</span>
          <br />
          <select
            name="pollDuration"
            value={pollDuration}
            onChange={(event) => {
              setpollDuration(event.target.value);
            }}
            className="pollDropdown"
          >
            <option value="1">1 day</option>
            <option value="3">3 days</option>
            <option value="7">7 days</option>
          </select>
          <p>Fields marked * are required</p>
        </form>
      </div>
      <div className="foot">
        <div className="btns">
          <Button btnText="Back" onClick={() => setPoll(false)} />
          <button form="myForm" className="btn1">
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
