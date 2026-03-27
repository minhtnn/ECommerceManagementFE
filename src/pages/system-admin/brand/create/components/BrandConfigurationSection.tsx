import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { TSystemConfigResponse } from "@/schemas/system-config.schema";
import { HelpCircle } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

interface BrandConfigurationSectionProps {
  systemConfigs: TSystemConfigResponse[];
  initialConfiguration?: string | null;
  disabled?: boolean;
  onChange: (json: string) => void;
}

type ConfigValues = Record<string, string>;

// Parse JSON configuration string từ brand thành map key -> value
const parseConfiguration = (configJson?: string | null): ConfigValues => {
  if (!configJson) return {};
  try {
    const parsed = JSON.parse(configJson);
    // Hỗ trợ cả 2 format: { key: value } hoặc { key: { Value: value } }
    const result: ConfigValues = {};
    for (const [k, v] of Object.entries(parsed)) {
      if (v && typeof v === "object" && "Value" in v) {
        result[k] = String((v as any).Value ?? "");
      } else {
        result[k] = String(v ?? "");
      }
    }
    return result;
  } catch {
    return {};
  }
};

// Kiểm tra 1 config có nên hiển thị không dựa trên dependencies + values hiện tại
const isConfigVisible = (
  config: TSystemConfigResponse,
  currentValues: ConfigValues,
  allConfigs: TSystemConfigResponse[],
): boolean => {
  // Không có dependency → luôn hiển thị
  if (!config.dependencies || config.dependencies.length === 0) return true;

  // Có dependency → tất cả trigger phải thỏa mãn
  return config.dependencies.every((dep) => {
    const triggerConfig = allConfigs.find((c) => c.id === dep.triggerKeyId);
    if (!triggerConfig) return false;
    const currentVal =
      currentValues[triggerConfig.key] ??
      triggerConfig.value ??
      triggerConfig.defaultValue ??
      "";
    return currentVal.toLowerCase() === dep.triggerValue.toLowerCase();
  });
};

export const BrandConfigurationSection = ({
  systemConfigs,
  initialConfiguration,
  disabled,
  onChange,
}: BrandConfigurationSectionProps) => {
  const [values, setValues] = useState<ConfigValues>(() =>
    parseConfiguration(initialConfiguration),
  );

  // Khi initialConfiguration thay đổi (lần đầu load), sync lại
  useEffect(() => {
    setValues(parseConfiguration(initialConfiguration));
  }, [initialConfiguration]);

  // Serialize values ra JSON và notify parent mỗi khi values thay đổi
  useEffect(() => {
    // Chỉ serialize những key đang visible và có value
    const visibleKeys = systemConfigs
      .filter((c) => isConfigVisible(c, values, systemConfigs))
      .map((c) => c.key);

    const payload: Record<string, string> = {};
    for (const key of visibleKeys) {
      const val = values[key];
      if (val !== undefined && val !== "") {
        payload[key] = val;
      }
    }

    onChange(JSON.stringify(payload));
  }, [values, systemConfigs]);

  const handleChange = (key: string, value: string) => {
    setValues((prev) => {
      const next = { ...prev, [key]: value };

      // Khi trigger key thay đổi → reset các dependent key bị ẩn
      const dependentKeys = systemConfigs
        .filter((c) =>
          c.dependencies.some((dep) => {
            const triggerConfig = systemConfigs.find(
              (x) => x.id === dep.triggerKeyId,
            );
            return (
              triggerConfig?.key === key &&
              dep.triggerValue.toLowerCase() !== value.toLowerCase()
            );
          }),
        )
        .map((c) => c.key);

      for (const depKey of dependentKeys) {
        delete next[depKey];
      }

      return next;
    });
  };

  // Sort theo displayOrder
  const sortedConfigs = useMemo(
    () => [...systemConfigs].sort((a, b) => a.displayOrder - b.displayOrder),
    [systemConfigs],
  );

  if (sortedConfigs.length === 0) {
    return (
      <p className="text-sm text-muted-foreground text-center py-4">
        Không có cấu hình nào
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {sortedConfigs.map((config) => {
        const visible = isConfigVisible(config, values, systemConfigs);
        const currentValue =
          values[config.key] ?? config.value ?? config.defaultValue ?? "";

        return (
          <div
            key={config.id}
            className={`transition-all duration-200 overflow-hidden ${
              visible
                ? "opacity-100 max-h-40"
                : "opacity-0 max-h-0 pointer-events-none"
            }`}
          >
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <Label className="text-sm font-medium">
                  {config.title}
                  {config.isRequired && (
                    <span className="text-destructive ml-1">*</span>
                  )}
                </Label>
                <Badge variant="outline" className="text-xs font-mono h-5">
                  {config.dataType}
                </Badge>
                {config.description && (
                  <TooltipProvider delayDuration={300}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <HelpCircle className="text-xs text-muted-foreground w-4 h-4" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className=""> {config.description}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
              </div>

              {/* Render input theo DataType */}
              {config.dataType === "Boolean" ? (
                <div className="flex items-center gap-2 pt-1">
                  <Switch
                    checked={currentValue === "true"}
                    onCheckedChange={(checked) =>
                      handleChange(config.key, checked ? "true" : "false")
                    }
                    disabled={disabled}
                  />
                  <span className="text-sm text-muted-foreground">
                    {currentValue === "true" ? "Bật" : "Tắt"}
                  </span>
                </div>
              ) : (
                <Input
                  value={currentValue}
                  onChange={(e) => handleChange(config.key, e.target.value)}
                  placeholder={
                    config.defaultValue ?? `Nhập ${config.title.toLowerCase()}`
                  }
                  disabled={disabled}
                  type={config.isSecure ? "password" : "text"}
                  className="h-9"
                />
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
