// DB의 productTable과 categoryTable을 조합한 형태입니다.
export interface Product{
    proNo: number;
    prdName: string;
    prdPrice: number;
    description: string; // 목록 페이지에서는 필요 없을 수 있음
    categoryName: string; // 카테고리 이름 (JOIN된 데이터)
    imageUrl: string; // 대표 이미지 URL (DB 스키마에는 없지만, S3 연동 시 필요)
    // --- 리뷰/평점 정보 (리뷰 담당과 협의 필요) ---
    reviewCount: number;
    averageRating: number;
}

// API로 보낼 필터 및 정렬 옵션 타입
export interface ProductFilterParams {
    categoryNo: number;
    skinType: string[];
    skinConcern: string[];
    page: number;
    size: number;
    sort: 'newest' | 'popularity' | 'priceDesc' | 'priceAsc';
}