interface ConnectorMiniProps {
  data: any;
}

export const ConnectorMini = ({ data }: ConnectorMiniProps) => {
  return (
    <div className="w-4 h-4 rounded-full bg-amber-500 dark:bg-amber-400 shadow-sm" />
  );
};

export default ConnectorMini;
