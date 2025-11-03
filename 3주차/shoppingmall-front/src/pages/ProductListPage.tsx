import React, { useState } from 'react';

// MUI와 Styled-components를 함께 사용
const PageContainer = styled(Container)`
    margin-top: 2rem;
`;

const FilterArea = styled(Grid)`
    /* 필터 사이드바 영역 */
`;

const ProductListArea = styled(Grid)`
    /* 상품 목록 영역 */
`;

const ProductListPage: React.FC = () => {
    // 1. 필터 상태 관리 (React state)
    // (나중에는 URL 쿼리 파라미터와 연동하는 'useSearchParams'로 고도화 가능)
    const [filters, setFilters] = useState<ProductFilterParams>({
        page: 1,
        size: 12,
        sort: 'popularity',
    });

    // 2. TanStack Query를 사용한 서버 상태 관리 (API 호출)
}