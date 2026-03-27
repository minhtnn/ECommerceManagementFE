import { PageLoader } from "@/components/LoadingScreen";
import { useBrand } from "@/hooks/use-brand";
import { handleApiError } from "@/lib/error";
import { useParams } from "react-router-dom";
import { BrandEditForm } from "./components/BrandEditForm";
import { useSystemConfig } from "@/hooks/use-system-config";

const BrandEditPage = () => {
  const { id } = useParams<{ id: string }>();
  const { getBrandById } = useBrand();
  const { getSystemConfigs } = useSystemConfig();
  const {
    data: brandData,
    isLoading: isBrandLoading,
    isError,
    error,
  } = getBrandById(id!, Intl.DateTimeFormat().resolvedOptions().timeZone);
  const { data: configData, isLoading: isConfigLoading } = getSystemConfigs();

  if (isBrandLoading || isConfigLoading) return <PageLoader />;
  if (isError && error) handleApiError(error);

  return (
    <BrandEditForm
      brand={brandData.data.data}
      id={id!}
      systemConfigs={configData?.data?.data ?? []}
    />
  );
};

export default BrandEditPage;
