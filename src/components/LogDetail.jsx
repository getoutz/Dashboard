import React from "react";

const StepProgress = () => {
  return (
    <>
      <button
        className="btn"
        onClick={() => document.getElementById("my_modal_4").showModal()}
      >
        open modal
      </button>
      <dialog id="my_modal_4" className="modal">
        <div className="modal-box w-11/12 max-w-4xl bg-white h-3/4">
          <h3 className="font-bold text-lg">Hello!</h3>
          <p>
            Lorem ipsum odor amet, consectetuer adipiscing elit. Nisl parturient
            metus consectetur tempus conubia nec litora habitant maximus cubilia
            leo lorem senectus dictum facilisi lacinia.
          </p>
          <hr className="my-4" />

          <div className="flex w-full overflow-hidden whitespace-nowrap">
            <div
              className="relative w-1/4 h-8 bg-gray-300 text-center leading-8"
              style={{
                clipPath: "polygon(0% 0%, 90% 0%, 100% 50%, 90% 100%, 0% 100%)",
              }}
            >
              Step 1
            </div>
            <div
              className="relative w-1/4 h-8 bg-gray-300 text-center leading-8"
              style={{
                clipPath:
                  "polygon(90% 0%, 0% 0%, 10% 50%, 0% 100%, 90% 100%, 100% 50%)",
              }}
            >
              Step 2
            </div>
            <div
              className="relative w-1/4 h-8 bg-gray-300 text-center leading-8"
              style={{
                clipPath:
                  "polygon(90% 0%, 0% 0%, 10% 50%, 0% 100%, 90% 100%, 100% 50%)",
              }}
            >
              Step 3
            </div>
            <div
              className="relative w-1/4 h-8 bg-gray-300 text-center leading-8"
              style={{
                clipPath:
                  "polygon(100% 0%, 0% 0%, 10% 50%, 0% 100%, 100% 100%, 100% 100%)",
              }}
            >
              Step 4
            </div>
          </div>
          <hr className="my-4" />

          {/* Timeline  */}
          <div className="flex flex-col p-12 gap-y-2 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 min-h-[200px] max-h-[485px] overflow-y-scroll">
          {[
              {
                date: "1 May 2021, 12:00 AM",
                status: "In progress",
                title: "Updated the status of Success Project",
                comment:
                  "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras sed facilisis nunc, lacinia feugiat velit.",
                color: "bg-blue-500",
                statusColor: "text-blue-500",
                step: 5,
              },
              {
                date: "1 May 2021, 12:00 AM",
                status: "Completed",
                title: "Updated the status of PR",
                comment:
                  "Suspendisse ac mauris convallis massa laoreet hendrerit eget vitae leo.",
                color: "bg-green-500",
                statusColor: "text-green-500",
                step: 4,
              },
              {
                date: "1 May 2021, 12:00 AM",
                status: "Completed",
                title: "Updated the status of 2D",
                comment:
                  "Curabitur arcu velit, suscipit ut massa in, vulputate lacinia orci.",
                color: "bg-green-500",
                statusColor: "text-green-500",
                step: 3,
              },
              {
                date: "1 May 2021, 12:00 AM",
                status: "Pending",
                title: "Updated the status of ...",
                comment:
                  "Curabitur arcu velit, suscipit ut massa in, vulputate lacinia orci.",
                color: "bg-gray-500",
                statusColor: "text-gray-500",
                step: 2,
              },
              {
                date: "1 May 2021, 12:00 AM",
                status: "Pending",
                title: "Project create success",
                comment:
                  "Curabitur arcu velit, suscipit ut massa in, vulputate lacinia orci.",
                color: "bg-gray-500",
                statusColor: "text-gray-500",
                step: 1,
              },
              // Additional data
              {
                date: "30 April 2021, 11:00 PM",
                status: "Completed",
                title: "Updated the status of Animation",
                comment:
                  "Curabitur arcu velit, suscipit ut massa in, vulputate lacinia orci.",
                color: "bg-green-500",
                statusColor: "text-green-500",
                step: 6,
              },
              {
                date: "29 April 2021, 11:00 PM",
                status: "Pending",
                title: "Updated the status of Music",
                comment:
                  "Curabitur arcu velit, suscipit ut massa in, vulputate lacinia orci.",
                color: "bg-gray-500",
                statusColor: "text-gray-500",
                step: 7,
              },
            ].map((item, index, arr) => (
              <div
                className="flex flex-row items-start gap-x-4 md:gap-x-6 lg:gap-x-8 mb-4"
                key={index}
              >
                {/* Ensure date part has consistent width */}
                <div className="flex-shrink-0 basis-24 md:basis-28 lg:basis-32 text-right text-sm lg:text-md font-sans text-slate-900 dark:text-slate-50">
                  {item.date}
                </div>

                {/* Circle and line part */}
                <div className="relative flex flex-col items-center">
                  <div
                    className={`flex w-6 h-6 md:w-7 md:h-7 lg:w-8 lg:h-8 rounded-full text-white items-center justify-center font-bold ${item.color}`}
                  >
                    {item.step}
                  </div>
                  {index !== arr.length - 1 && (
                    <div className="absolute top-full mt-1 w-px h-full bg-gray-300 dark:bg-gray-600"></div>
                  )}
                </div>

                {/* Content part */}
                <div className="flex-grow flex min-w-48 md:min-w-52 lg:min-w-60 flex-col text-sm lg:text-md gap-y-2">
                  <div className={`font-semibold ${item.statusColor}`}>
                    {item.status}
                  </div>
                  <div className="font-bold text-slate-900 dark:text-slate-50">
                    {item.title}
                  </div>
                  <div className="text-slate-600 dark:text-slate-400 text-sm">
                    {item.comment}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </dialog>
    </>
  );
};

export default StepProgress;
