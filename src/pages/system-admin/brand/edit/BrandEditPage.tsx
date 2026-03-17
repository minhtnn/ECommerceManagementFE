import { PageLoader } from "@/components/LoadingScreen";
import { useBrand } from "@/hooks/use-brand";
import { handleApiError } from "@/lib/error";
import { useParams } from "react-router-dom";
import { BrandEditForm } from "./components/BrandEditForm";

const BrandEditPage = () => {
  const { id } = useParams<{ id: string }>();
  const { getBrandById } = useBrand();
  const { data: brandData, isLoading, isError, error } = getBrandById(id!);

  if (isLoading) return <PageLoader />;
  if (isError && error) handleApiError(error);

  return <BrandEditForm brand={brandData.data.data} id={id!} />;
};

export default BrandEditPage;