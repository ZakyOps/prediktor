import AppLayout from "@/components/AppLayout";
import ProtectedRoute from "@/components/ui/ProtectedRoute";

const Index = () => {
  return (
    <ProtectedRoute>
      <AppLayout />
    </ProtectedRoute>
  );
};

export default Index;
