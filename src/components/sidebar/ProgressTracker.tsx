import {
  useProgressTrackerStore,
} from "@/store/progressTrackerStore";
import { Card } from "antd";
import { CheckCircle2, Loader2, XCircle } from "lucide-react";
import { ProgressStepStatus } from "../constants/ProgressStatus";

const statusDot = (status: ProgressStepStatus) => {
  switch (status) {
    case ProgressStepStatus.Completed:
      return <CheckCircle2 className="w-5 h-5 text-green-500" />;
    case ProgressStepStatus.InProgress:
      return <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />;
    case ProgressStepStatus.Error:
      return <XCircle className="w-5 h-5 text-red-500" />;
    case ProgressStepStatus.Pending:
    default:
      return (
        <div className="w-4 h-4 border-2 border-gray-300 rounded-full bg-white" />
      );
  }
};

const ProgressTracker = () => {
  const { steps } = useProgressTrackerStore();

  return (
    <Card
      title="Progress Tracker"
      className="w-full bg-gray-50 rounded-xl mt-6 shadow"
      styles={{
        header: {
          fontSize: "1rem",
          fontWeight: "600",
          backgroundColor: "#f0f8ff",
        },
      }}
    >
      <div className="space-y-6 relative border-l-2 border-gray-200 pl-6">
        {steps.map((step, index) => {
          const Icon = step.icon;

          return (
            <div key={index} className="relative">
              {/* Status Dot */}
              <div className="absolute -left-[18px] top-1.5">
                {statusDot(step.status)}
              </div>

              {/* Step Content */}
              <div
                className={`flex items-center gap-3 ${
                  step.status === "completed"
                    ? "text-green-700"
                    : step.status === "in-progress"
                    ? "text-blue-700 font-medium"
                    : step.status === "error"
                    ? "text-red-600"
                    : "text-gray-500"
                }`}
              >
                <Icon className="w-5 h-5 ml-2" />
                <span className="text-sm">{step.label}</span>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
};

export default ProgressTracker;
