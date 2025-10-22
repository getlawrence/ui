interface ExporterMiniProps {
  data: any;
}

export const ExporterMini = ({ data }: ExporterMiniProps) => {
  return (
    <div className="w-4 h-4 rounded-full bg-purple-500 dark:bg-purple-400 shadow-sm" />
  );
};

export default ExporterMini;
