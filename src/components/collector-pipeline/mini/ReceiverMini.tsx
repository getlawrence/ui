interface ReceiverMiniProps {
  data: any;
}

export const ReceiverMini = ({ data }: ReceiverMiniProps) => {
  return (
    <div className="w-4 h-4 rounded-full bg-blue-500 dark:bg-blue-400 shadow-sm" />
  );
};

export default ReceiverMini;
