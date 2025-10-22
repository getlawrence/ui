interface ProcessorMiniProps {
  data: any;
}

export const ProcessorMini = ({ data }: ProcessorMiniProps) => {
  return (
    <div className="w-4 h-4 rounded-full bg-green-500 dark:bg-green-400 shadow-sm" />
  );
};

export default ProcessorMini;
