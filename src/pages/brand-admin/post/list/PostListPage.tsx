import { Button } from "@/components/ui/button";
import { PATH_BRAND_DASHBOARD } from "@/routes/path";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import PostTable from "./components/PostTable";

const PostListPage = () => {
    const navigate = useNavigate();
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">Quản lý bài đăng</h1>
                <Button
                    className="bg-primary hover:bg-primary/90"
                    onClick={() => navigate(PATH_BRAND_DASHBOARD.posts.create)}
                >
                    <Plus className="w-4 h-4 mr-2" />
                    Thêm bài đăng mới
                </Button>
            </div>
            <PostTable />
        </div>
    );
};

export default PostListPage;