import { Product, ProductFilterParams } from '../types/product';

// 가상의 API 응답 타입 (페이지네이션 포함)
interface ProductApiResponse{
    content: Product[];
    totalPages: number;
    totalElements: number;
    isLast: boolean;
}

export const fetchProducts = async (
    filters: ProductFilterParams
): Promise<ProductApiResponse> => {
    const queryParams = new URLSearchParams({
        page: filters.page.toString(),
        size: filters.size.toString(),
        sort: filters.sort,
    }).toString();

    const response = await fetch(`/api/products?${queryParams}`);

    if(!response.ok) {
        throw new Error('상품 목록을 불러오는 데 실패했습니다.');
    }

    // 나중에 백엔드에서 이 형식에 맞춰 데이터를 보내줍니다.
    return response.json();

    /*
  // 임시 Mock 데이터 예시:
  return Promise.resolve({
    content: [
      { prdNo: 1, prdName: '히알루론산 인텐시브 세럼', prdPrice: 45000, categoryName: '스킨케어', imageUrl: '...', reviewCount: 3421, averageRating: 4.8 },
      { prdNo: 2, prdName: '비타C C 브라이트닝 토너', prdPrice: 52000, categoryName: '스킨케어', imageUrl: '...', reviewCount: 2166, averageRating: 4.5 }
    ],
    totalPages: 10,
    totalElements: 100,
    isLast: false,
  });
  */

};