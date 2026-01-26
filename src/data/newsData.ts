export interface NewsArticle {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  image: string;
  publishDate: string;
  endDate: string;
  status: "active" | "inactive" | "scheduled";
}

export const newsArticles: NewsArticle[] = [
  {
    id: "1",
    slug: "hanh-trinh-tu-cao-nguyen",
    title: "HÀNH TRÌNH TỪ CAO NGUYÊN ĐẾN LY CÀ PHÊ TRUYỀN THỐNG",
    excerpt: "Bạn đã bao giờ tự hỏi ly cà phê thơm lừng mỗi sáng đến từ đâu? Với Uni Coffee Roastery, đó không chỉ là một thức uống – đó là cả một hành trình từ những cao nguyên Việt Nam trù phú đến bàn tay bạn.",
    content: `<p><em>Khởi nguồn từ cao nguyên đất đỏ đến từng hạt cà phê Highlands rang xay chuẩn gu Việt.</em></p>

<p>Với Highlands đây không chỉ là cà phê, mà còn là niềm tự hào văn hóa trong từng ly, là lựa chọn hoàn hảo cho gia đình, văn phòng, hay những ai muốn tự tay pha chế tại nhà mà vẫn giữ được vị quán quen thuộc. Chính sự kết hợp giữa hương vị, giá trị và tính tiện lợi đã khiến "Cà phê Truyền Thống" trở thành sản phẩm yêu thích.</p>

<p>Bạn đã bao giờ tự hỏi ly cà phê thơm lừng mỗi sáng đến từ đâu? Với Highlands Coffee, đó không chỉ là một thức uống – đó là cả một hành trình từ những cao nguyên Việt Nam trù phú đến bàn tay bạn.</p>

<h3>Khởi nguồn từ Cao Nguyên đất đỏ</h3>

<p>Highlands Coffee tự hào mang đến tinh hoa từ những hạt tuyển chọn trên vùng Cao Nguyên bazan đỏ rực. Được tắm mình trong nắng gió Tây Nguyên, những hạt cà phê tại đây hấp thu trọn vẹn dưỡng chất từ đất đai, mang đến vị đậm đà đặc trưng không thể nhầm lẫn. "Cà phê rang xay Truyền Thống" chính là kết tinh của vùng đất ấy – nơi mỗi hạt cà phê kể một câu chuyện về sự bền bỉ và chất lượng.</p>

<h3>Rang xay chuẩn gu Việt</h3>

<p>Không dừng lại ở việc chọn hạt, Highlands Coffee còn nâng tầm "cà phê rang xay Truyền Thống" bằng quy trình rang xay tỉ mỉ. Từng mẻ cà phê được rang ở nhiệt độ và thời gian chính xác, giữ trọn hương thơm tự nhiên và hậu vị kéo dài. Đây là bí quyết để mỗi giọt cà phê chảy qua phin đậm đà, cuốn hút – đúng chuẩn gu Việt Nam mà bạn yêu thích tại các quán Highlands. Không chỉ là cà phê, mà còn là niềm tự hào văn hóa trong từng ly.</p>

<h3>Vì sao Cà phê bột/rang xay Truyền Thống là best-seller?</h3>

<p>Với trọng lượng 200gr và 1kg, sản phẩm này mang đến sự tiết kiệm mà vẫn đảm bảo chất lượng khi pha tại nhà. Một túi "Truyền Thống 1kg" có thể pha hơn 50 ly cà phê đen đá hay sữa đá – giá tiết kiệm, rẻ hơn rất nhiều nếu tự pha chế. Chưa kể, đây là lựa chọn hoàn hảo cho gia đình, văn phòng, hay những ai muốn tự tay pha tại nhà mà vẫn giữ được vị quán quen thuộc. Chính sự kết hợp giữa hương vị, giá trị và tính tiện lợi đã khiến "Cà phê Truyền Thống" trở thành sản phẩm yêu thích của hàng ngàn khách hàng Highlands.</p>

<h3>Mang Highlands về nhà bạn!</h3>

<p>Dù bạn là người mê cà phê đen đậm vị hay yêu thích sữa đá ngọt ngào, Highlands Truyền Thống đều sẵn sàng đồng hành. Hãy tưởng tượng mỗi sáng thức dậy, mùi cà phê thơm lừng lan tỏa từ phin, đánh thức mọi giác quan – tất cả chỉ với ly cà phê từ Highlands.</p>

<p>👉 <strong>Mua Truyền Thống 1kg ngay tại đây</strong> – Giao hàng tận cửa!</p>`,
    image: "/placeholder.svg",
    publishDate: "2025-02-15",
    endDate: "2025-12-31",
    status: "active",
  },
  {
    id: "2",
    slug: "dang-ky-thanh-vien",
    title: "ĐĂNG KÝ THÀNH VIÊN",
    excerpt: "Lợi ích khi trở thành KHÁCH HÀNG THÂN THIẾT: Giảm giá độc quyền, điểm thưởng, ưu tiên đối với sản phẩm mới và nhiều đặc quyền hấp dẫn khác.",
    content: `<p>Lợi ích khi trở thành <strong>KHÁCH HÀNG THÂN THIẾT</strong>:</p>

<ul>
  <li><strong>Giảm giá độc quyền:</strong> Bạn sẽ nhận được các ưu đãi giảm giá đặc biệt chỉ dành cho thành viên, giúp bạn tiết kiệm khi mua hàng.</li>
  <li><strong>Điểm thưởng:</strong> Tích lũy được điểm thưởng cho mỗi đơn hàng, sau đó có thể đổi điểm thành quà tặng hoặc giảm giá.</li>
  <li><strong>Ưu tiên đối với sản phẩm mới:</strong> Bạn sẽ là một trong những người đầu tiên được trải nghiệm các sản phẩm mới nhất.</li>
  <li><strong>Nhận ngàn ưu đãi đặc biệt:</strong> Các chương trình khuyến mãi và ưu đãi độc quyền dành riêng cho thành viên.</li>
  <li><strong>Tích điểm đổi quà:</strong> Mỗi đơn hàng đều giúp bạn tích lũy điểm để đổi lấy những phần quà hấp dẫn.</li>
</ul>

<p>Đăng ký thành viên ngay hôm nay để không bỏ lỡ bất kỳ ưu đãi nào!</p>`,
    image: "/placeholder.svg",
    publishDate: "2025-02-10",
    endDate: "2025-12-31",
    status: "active",
  },
  {
    id: "3",
    slug: "bi-quyet-pha-ca-phe",
    title: "BÍ QUYẾT PHA CÀ PHÊ NGON TẠI NHÀ",
    excerpt: "Pha cà phê ngon tại nhà không hề khó như bạn nghĩ. Với những mẹo nhỏ từ các chuyên gia, bạn hoàn toàn có thể tạo ra những tách cà phê thơm ngon như quán.",
    content: `<p>Pha cà phê ngon tại nhà không hề khó như bạn nghĩ. Với những mẹo nhỏ từ các chuyên gia của Uni Coffee Roastery, bạn hoàn toàn có thể tạo ra những tách cà phê thơm ngon như quán ngay tại không gian của mình.</p>

<h3>1. Chọn cà phê chất lượng</h3>
<p>Hạt cà phê tươi mới rang trong vòng 2-4 tuần sẽ cho hương vị tốt nhất. Bảo quản cà phê ở nơi khô ráo, tránh ánh sáng trực tiếp.</p>

<h3>2. Tỉ lệ pha chuẩn</h3>
<p>Tỉ lệ vàng là 1:15 đến 1:17 (1 gram cà phê : 15-17ml nước). Điều chỉnh theo khẩu vị cá nhân.</p>

<h3>3. Nhiệt độ nước</h3>
<p>Nước ở 90-96°C là lý tưởng. Nước quá nóng sẽ làm cà phê đắng, quá nguội sẽ không chiết xuất hết hương vị.</p>

<h3>4. Thời gian chiết xuất</h3>
<p>Với phin Việt Nam: 4-6 phút<br/>
Với pour over: 2.5-3.5 phút<br/>
Với espresso: 25-30 giây</p>

<p>Hãy thử nghiệm và tìm ra công thức hoàn hảo cho riêng mình!</p>`,
    image: "/placeholder.svg",
    publishDate: "2025-02-01",
    endDate: "2025-12-31",
    status: "active",
  },
];
