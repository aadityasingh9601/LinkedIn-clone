import styles from "./PollForm.module.css";
import Button from "../shared-components/Buttons/Button";
import { useForm } from "react-hook-form";
import usePollStore from "../../stores/Poll";
import RHFtextarea from "../shared-components/Textarea/RHFtextarea";
import { PollDataSchema } from "../../zodSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import FormWrapper from "../shared-components/Forms/FormWrapper";
import RHFselect from "../shared-components/Select/RHFselect";
import RHFInput from "../shared-components/Inputs/RHFInput";

export default function PollForm() {
  const setPoll = usePollStore((s) => s.setPoll);
  const createPoll = usePollStore((s) => s.createPoll);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(PollDataSchema),
  });

  const onSubmit = (data) => {
    console.log(data);
    const pollData = {
      ...data,
      pollDuration: data.pollDuration.split(" ")[0],
    };
    createPoll(pollData);
  };

  return (
    <div className={styles.pollform}>
      <div className={styles.head}>Create a Poll</div>
      <div className={styles.body}>
        <FormWrapper onSubmit={handleSubmit(onSubmit)} id="myForm">
          <div className={styles.option}>
            <div>Question</div>
            <RHFtextarea
              placeholder="Eg. How do you commute to work?"
              name="question"
              register={register}
              errors={errors}
            />
          </div>

          <div className={styles.option}>
            <div>Option 1</div>
            <RHFInput
              name="options.0"
              placeholder="Eg. Public transport"
              register={register}
              errors={{
                "options.0": errors.options?.[0],
              }}
            />
          </div>

          <div className={styles.option}>
            <div>Option 2</div>
            <RHFInput
              name="options.1"
              placeholder="Eg. Car"
              register={register}
              errors={{
                "options.1": errors.options?.[1],
              }}
            />
          </div>

          <div className={styles.option}>
            <div>Option 3</div>
            <RHFInput
              name="options.2"
              placeholder="Eg. Bicycle"
              register={register}
              errors={{
                "options.2": errors.options?.[2],
              }}
            />
          </div>

          <div className={styles.option}>
            <div>Option 4</div>
            <RHFInput
              name="options.3"
              placeholder="Eg. Walk"
              register={register}
              errors={{
                "options.3": errors.options?.[3],
              }}
            />
          </div>

          <RHFselect
            name="pollDuration"
            register={register}
            label="Poll Duration"
            options={["1 day", "3 days", "7 days"]}
          />
        </FormWrapper>
      </div>
      <div className={styles.footer}>
        <div className={styles.btns}>
          <Button btnText="Back" variant="sm" onClick={() => setPoll(false)} />
          <Button btnText="Done" variant="sm" form="myForm" />
        </div>
      </div>
    </div>
  );
}
