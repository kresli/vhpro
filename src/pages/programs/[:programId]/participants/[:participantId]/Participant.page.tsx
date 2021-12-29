import { CalendarIcon } from "@heroicons/react/solid";
import { FunctionComponent, useState } from "react";
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
import { Card, ProgramPage } from "src/components";
import { useApi } from "src/contexts";
import DatePicker from "react-datepicker";
import classNames from "classnames";

const DateRangePicker = () => {
  return (
    <div className="flex items-center">
      <div className="relative">
        <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
          <CalendarIcon className="w-5 text-gray-400" />
        </div>
        <input
          name="start"
          type="text"
          className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-l-lg block w-full pl-10 p-2.5"
          placeholder="Select date start"
        />
      </div>
      <div className="relative">
        <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
          <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
            <CalendarIcon className="w-5 text-gray-400" />
          </div>
        </div>
        <input
          name="end"
          type="text"
          className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-r-lg block w-full pl-10 p-2.5"
          placeholder="Select date end"
        />
      </div>
    </div>
  );
};

const Stack: FunctionComponent<{
  direction?: "row" | "column";
  justify?:
    | "center"
    | "justify-start"
    | "end"
    | "center"
    | "between"
    | "around"
    | "evenly"
    | "items-start"
    | "items-end"
    | "items-center"
    | "items-stretch"
    | "self-auto"
    | "self-start"
    | "self-end"
    | "self-center"
    | "self-stretch";
  overflow?:
    | "ellipsis"
    | "auto"
    | "hidden"
    | "clip"
    | "visible"
    | "scroll"
    | "x-auto"
    | "x-hidden"
    | "x-clip"
    | "x-visible"
    | "x-scroll"
    | "y-auto"
    | "y-hidden"
    | "y-clip"
    | "y-visible"
    | "y-scroll";
  width?: number;
  grow?: boolean;
}> = ({ children, direction, justify, overflow, width, grow }) => (
  <div
    className={classNames("flex", {
      [`w-${width}`]: width,
      [`justify-${justify}`]: justify,
      [`overflow-${overflow}`]: overflow,
      "flex-row": direction === "row",
      "flex-col": direction === "column",
      grow: grow,
      "grow-0": !grow,
    })}
  >
    {children}
  </div>
);

const Header: FunctionComponent<{ name: string }> = ({ name }) => {
  return (
    <div className="flex p-4">
      <div className="text-4xl flex flex-1">{name}</div>
    </div>
  );
};
export const ParticipantPage = () => {
  const api = useApi();
  const { programId, participantId } =
    useParams<{ programId: string; participantId: string }>();
  const { data: program } = useQuery(
    [programId],
    async () => (await api.getProgram(programId)).data
  );
  const { data: participant } = useQuery(
    [programId, participantId],
    async () => (await api.getPatient({ participantId, programId })).data
  );
  const { data: participants } = useQuery(
    [programId, "patients"],
    async () => (await api.getPatients({ programId })).data
  );
  return (
    <ProgramPage
      programId={programId}
      participants={participants || []}
      program={program}
      selectedParticipantId={participantId}
    >
      <div className="flex flex-col justify-center outline-hidden">
        <Header name={`${participant?.firstName} ${participant?.lastName}`} />

        <div className="flex flex-row">
          <div className="flex w-96 flex-col">
            <DateRangePicker />
            <div className="flex overflow-hidden pl-1 flex-col">
              {Array.from({ length: 31 }).map((_, i) => (
                <div className="border border-gray-600  justify-center flex flex-1 items-center">
                  {i + 1}
                </div>
              ))}
            </div>
          </div>
          <div className="flex flex-1">content</div>
        </div>
      </div>
    </ProgramPage>
  );
};
