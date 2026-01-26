import { createContext, ReactNode, useContext, useMemo, useState } from 'react';

interface BreadcrumbItem {
  title: string;
  url?: string;
}

const BreadcrumbStateContext = createContext<{
  breadcrumbs: BreadcrumbItem[];
  showBreadcrumb: boolean;
} | undefined>(undefined);

const BreadcrumbActionsContext = createContext<{
  setBreadcrumbs: (items: BreadcrumbItem[]) => void;
  setShowBreadcrumb: (show: boolean) => void;
} | undefined>(undefined);

export const BreadcrumbProvider = ({ children }: { children: ReactNode }) => {
  const [breadcrumbs, setBreadcrumbs] = useState<BreadcrumbItem[]>([]);
  const [showBreadcrumb, setShowBreadcrumb] = useState(false);

  const stateValue = useMemo(
    () => ({ breadcrumbs, showBreadcrumb }),
    [breadcrumbs, showBreadcrumb]
  );

  const actionsValue = useMemo(
    () => ({ setBreadcrumbs, setShowBreadcrumb }),
    []
  );

  return (
    <BreadcrumbStateContext.Provider value={stateValue}>
      <BreadcrumbActionsContext.Provider value={actionsValue}>
        {children}
      </BreadcrumbActionsContext.Provider>
    </BreadcrumbStateContext.Provider>
  );
};

// Hook để lấy state (components chỉ đọc)
export const useBreadcrumbState = () => {
  const context = useContext(BreadcrumbStateContext);
  if (!context) {
    throw new Error('useBreadcrumbState must be used within BreadcrumbProvider');
  }
  return context;
};

// Hook để lấy actions (components chỉ update)
export const useBreadcrumbActions = () => {
  const context = useContext(BreadcrumbActionsContext);
  if (!context) {
    throw new Error('useBreadcrumbActions must be used within BreadcrumbProvider');
  }
  return context;
};

export const useBreadcrumb = () => {
  return {
    ...useBreadcrumbState(),
    ...useBreadcrumbActions(),
  };
};