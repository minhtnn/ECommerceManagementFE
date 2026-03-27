// pages/system-admin/system-config/SystemConfigPage.tsx
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useSystemConfig } from "@/hooks/use-system-config";
import { handleApiError } from "@/lib/error";
import {
  TCreateSystemConfigRequest,
  TSystemConfigResponse,
  TUpdateSystemConfigRequest,
} from "@/schemas/system-config.schema";
import { EConfigDataType } from "@/types/enums/config-data-type.enum";
import { LoaderCircle, Pencil, Plus, RefreshCw } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { SystemConfigFormDialog } from "./components/SystemConfigFormDialog";

const DATA_TYPE_VARIANT: Record<
  string,
  "default" | "secondary" | "outline" | "destructive"
> = {
  [EConfigDataType.Boolean]: "default",
  [EConfigDataType.String]: "secondary",
  [EConfigDataType.Number]: "outline",
  [EConfigDataType.Json]: "destructive",
};

const SystemConfigPage = () => {
  const { getSystemConfigs, createSystemConfig, updateSystemConfig } =
    useSystemConfig();

  const { data, isLoading, isError, error, refetch } = getSystemConfigs();
  const createMutation = createSystemConfig();
  const updateMutation = updateSystemConfig();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<"create" | "edit">("create");
  const [selectedConfig, setSelectedConfig] =
    useState<TSystemConfigResponse | null>(null);

  const configs: TSystemConfigResponse[] = data?.data?.data ?? [];

  const handleOpenCreate = () => {
    setSelectedConfig(null);
    setDialogMode("create");
    setDialogOpen(true);
  };

  const handleOpenEdit = (config: TSystemConfigResponse) => {
    setSelectedConfig(config);
    setDialogMode("edit");
    setDialogOpen(true);
  };

  const handleSubmit = async (
    formData: TCreateSystemConfigRequest | TUpdateSystemConfigRequest,
  ) => {
    try {
      if (dialogMode === "create") {
        await createMutation.mutateAsync(
          formData as TCreateSystemConfigRequest,
        );
        toast.success("Tạo system config thành công");
      } else {
        await updateMutation.mutateAsync(
          formData as TUpdateSystemConfigRequest,
        );
        toast.success("Cập nhật system config thành công");
      }
      setDialogOpen(false);
    } catch (err) {
      handleApiError(err);
    }
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  if (isError && error) handleApiError(error);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">System Configuration</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Quản lý các cấu hình hệ thống
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => refetch()}
            disabled={isLoading}
          >
            <RefreshCw
              className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`}
            />
          </Button>
          <Button onClick={handleOpenCreate}>
            <Plus className="h-4 w-4 mr-2" />
            Thêm config
          </Button>
        </div>
      </div>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            Danh sách ({configs.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-12">
              <LoaderCircle className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : configs.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <p>Chưa có system config nào</p>
              <Button
                variant="outline"
                className="mt-3"
                onClick={handleOpenCreate}
              >
                <Plus className="h-4 w-4 mr-2" />
                Tạo ngay
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">#</TableHead>
                  <TableHead>Key</TableHead>
                  <TableHead>Tiêu đề</TableHead>
                  <TableHead>Kiểu</TableHead>
                  <TableHead>Giá trị</TableHead>
                  <TableHead>Bắt buộc</TableHead>
                  <TableHead>Bảo mật</TableHead>
                  <TableHead>Phụ thuộc</TableHead>
                  <TableHead className="w-[80px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {configs
                  .sort((a, b) => a.displayOrder - b.displayOrder)
                  .map((config, idx) => (
                    <TableRow key={config.id}>
                      <TableCell className="text-muted-foreground text-sm">
                        {idx + 1}
                      </TableCell>

                      <TableCell>
                        <code className="text-xs bg-muted px-1.5 py-0.5 rounded font-mono">
                          {config.key}
                        </code>
                      </TableCell>

                      <TableCell>
                        <div>
                          <p className="text-sm font-medium">{config.title}</p>
                          {config.description && (
                            <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                              {config.description}
                            </p>
                          )}
                        </div>
                      </TableCell>

                      <TableCell>
                        <Badge
                          variant={
                            DATA_TYPE_VARIANT[config.dataType] ?? "secondary"
                          }
                          className="text-xs"
                        >
                          {config.dataType}
                        </Badge>
                      </TableCell>

                      <TableCell>
                        {config.value ? (
                          <code className="text-xs bg-muted px-1.5 py-0.5 rounded">
                            {config.value}
                          </code>
                        ) : config.defaultValue ? (
                          <span className="text-xs text-muted-foreground italic">
                            default: {config.defaultValue}
                          </span>
                        ) : (
                          <span className="text-xs text-muted-foreground">
                            —
                          </span>
                        )}
                      </TableCell>

                      <TableCell>
                        <Badge
                          variant={config.isRequired ? "default" : "outline"}
                          className="text-xs"
                        >
                          {config.isRequired ? "Có" : "Không"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={config.isSecure ? "default" : "outline"}
                          className="text-xs"
                        >
                          {config.isSecure ? "Có" : "Không"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {config.dependencies.length > 0 ? (
                          <div className="flex flex-wrap gap-1">
                            {config.dependencies.map((dep) => (
                              <Badge
                                key={dep.id}
                                variant="outline"
                                className="text-xs font-mono"
                              >
                                {dep.triggerKey} = {dep.triggerValue}
                              </Badge>
                            ))}
                          </div>
                        ) : (
                          <span className="text-xs text-muted-foreground">
                            —
                          </span>
                        )}
                      </TableCell>

                      <TableCell>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => handleOpenEdit(config)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Dialog */}
      <SystemConfigFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        mode={dialogMode}
        initialData={selectedConfig ?? undefined}
        allConfigs={configs}
        onSubmit={handleSubmit}
        isPending={isPending}
      />
    </div>
  );
};

export default SystemConfigPage;
