interface ResourceMeterProps {
    label: string;
    value: number;
    max?: number;
    color: string;
    unit?: string;
  }
  
  export const ResourceMeter = ({ label, value, max = 100, color, unit = "%" }: ResourceMeterProps) => (
    <div className="mb-4">
      <div className="flex justify-between mb-1">
        <span className="text-xs text-gray-500">{label}</span>
        <span className="text-xs font-medium">
          {value}
          {unit}
        </span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className={`${color} h-2 rounded-full`}
          style={{ width: `${(value / max) * 100}%` }}
        ></div>
      </div>
    </div>
  );