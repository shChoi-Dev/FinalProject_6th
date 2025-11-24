import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import Pagination from '../../components/admin/Pagination';
import Spinner from '../../components/admin/Spinner';
import { toast } from 'react-toastify';

import {
  Input, Select,
  Dashboard,
  DashCard,
  DashCardTitle,
  DashCardValue,
  ContentHeader,
  ContentTitle,
  Card,
  ButtonLink,
  Button,
  TableWrapper, Table, Th, Td
} from '../../styles/admincommon';

const LIMIT = 6;

// 상태 필터 옵션
const statusOptions = [
  { label: '판매중', value: 'SALE' },
  { label: '품절', value: 'SOLD_OUT' },
  { label: '판매중지', value: 'STOP' }
];

const FilterContainer = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
`;

const SearchInput = styled(Input)`
  flex: 1;
  width: auto;
  padding: 10px;
  font-size: 14px;
`;

const FilterSelect = styled(Select)`
  width: auto;
  min-width: 160px;
  padding: 10px;
  font-size: 14px;
`;

const ProductImage = styled.img`
  width: 50px;
  height: 50px;
  object-fit: cover;
  border-radius: 4px;
`;

const StatusTag = styled.span`
  padding: 4px 8px;
  border-radius: 12px;
  color: white;
  font-weight: 600;
  /* 상태 텍스트에 따라 배경색 변경 */
  background-color: ${props => {
    switch (props.$status) {
      case '판매중': return '#28a745'; // 초록색
      case '품절': return '#dc3545';   // 빨간색
      case '판매중지': return '#fd7e14'; // 주황색
      default: return '#333';
    }
  }};
`;

const EditLink = styled(Link)`
  color: blue;
  text-decoration: none;
  margin-right: 10px;
  &:hover {
    text-decoration: underline;
  }
`;

const DeleteButton = styled.button`
  color: red;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  font-size: 14px;
  &:hover {
    text-decoration: underline;
  }
`;

const Content = styled(Card)`
  padding: ${props => props.theme.spacing.large};
`;

function AdminProductList() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]); // 카테고리 데이터
  const [isLoading, setIsLoading] = useState(true);

  // 검색 및 필터 상태
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  const [dashboardCounts, setDashboardCounts] = useState({
    totalProducts: 0,
    inStock: 0,
    outOfStock: 0,
    totalStock: 0
  });

  // 카테고리 목록 로드 (필터용)
  useEffect(() => {
    fetch('http://localhost:8080/api/categories')
      .then(res => res.json())
      .then(data => setCategories(data))
      .catch(err => console.error("카테고리 로드 실패:", err));
  }, []);

  // 상품 목록 및 통계 로드
  useEffect(() => {
    const loadProducts = async () => {
      setIsLoading(true);
      try {
        // 상품 목록 조회
        const params = new URLSearchParams({
          page: currentPage,
          size: LIMIT,
          sort: 'idAsc'
        });

        if (searchTerm) params.append('q', searchTerm);
        if (selectedCategory) params.append('categoryNo', selectedCategory);
        if (selectedStatus) params.append('status', selectedStatus);

        const productRes = await fetch(`http://localhost:8080/api/products?${params.toString()}`);
        if (!productRes.ok) throw new Error('네트워크 응답이 올바르지 않습니다.');
        const productData = await productRes.json();

        setProducts(productData.content);
        setTotalPages(productData.totalPages);

        // 대시보드 통계 조회
        const statsRes = await fetch('http://localhost:8080/api/admin/stats');
        if (statsRes.ok) {
          const statsData = await statsRes.json();
          setDashboardCounts({
            totalProducts: statsData.totalProducts,
            inStock: statsData.inStockProducts,
            outOfStock: statsData.outOfStockProducts,
            totalStock: statsData.totalStock
          });
        }

      } catch (error) {
        console.error("데이터 로드 실패:", error);
        toast.error("데이터를 불러오는 데 실패했습니다.");
      }
      setIsLoading(false);
    };

    loadProducts();
  }, [currentPage, searchTerm, selectedCategory, selectedStatus]);

  const handleFilterChange = (setter) => (e) => {
    setter(e.target.value);
    setCurrentPage(1); // 필터 변경 시 1페이지로 리셋
  };

  const handleDelete = async (product) => {
    const confirmMessage = `상품을 삭제하시겠습니까?\n\n상품명: ${product.prdName}\n\n이 작업은 취소할 수 없습니다.`;
    if (window.confirm(confirmMessage)) {
      try {
        const response = await fetch(`http://localhost:8080/api/admin/products/${product.prdNo}`, {
          method: 'DELETE',
        });

        if (!response.ok) {
          throw new Error('상품 삭제 실패');
        }

        toast.success(`'${product.prdName}' 상품이 삭제되었습니다.`);
        console.log(`[관리자] ${product.prdName} 삭제 완료`);

        // 삭제 후 새로고침 효과
        if (products.length === 1 && currentPage > 1) {
          setCurrentPage(prev => prev - 1);
        } else {
          // 현재 목록에서 제거하여 즉시 반영
          setProducts(prev => prev.filter(p => p.prdNo !== product.prdNo));
          setDashboardCounts(prev => ({ ...prev, totalProducts: prev.totalProducts - 1 }));
        }
      } catch (error) {
        toast.error("삭제 중 오류가 발생했습니다.");
      }
    }
  };

  return (
    <>
      {/* --- 대시보드 --- */}
      <Dashboard>
        <DashCard>
          <DashCardTitle>전체 상품</DashCardTitle>
          <DashCardValue>{dashboardCounts.totalProducts}</DashCardValue>
        </DashCard>
        <DashCard>
          <DashCardTitle>판매중</DashCardTitle>
          <DashCardValue>{dashboardCounts.inStock}</DashCardValue>
        </DashCard>
        <DashCard>
          <DashCardTitle>품절</DashCardTitle>
          <DashCardValue>{dashboardCounts.outOfStock}</DashCardValue>
        </DashCard>
        <DashCard>
          <DashCardTitle>총 재고</DashCardTitle>
          <DashCardValue>{dashboardCounts.totalStock.toLocaleString()}</DashCardValue>
        </DashCard>
      </Dashboard>

      {/* --- 상품 목록 --- */}
      <Content>
        <ContentHeader>
          <ContentTitle>상품 목록</ContentTitle>
          <div>
            <Button onClick={() => window.location.reload()} style={{ marginRight: '10px' }}>🔄 새로고침</Button>
            <ButtonLink to="/admin/product/new" $primary>
              + 상품 등록
            </ButtonLink>
          </div>
        </ContentHeader>

        {/* 검색 / 필터 */}
        <FilterContainer>
          {/* 상품명 검색 */}
          <SearchInput
            type="text"
            placeholder="상품명으로 검색..."
            value={searchTerm}
            onChange={handleFilterChange(setSearchTerm)}
          />

          {/* 카테고리 선택 */}
          <FilterSelect
            value={selectedCategory}
            onChange={handleFilterChange(setSelectedCategory)}
          >
            <option value="">전체 카테고리</option>
            {/* 카테고리 계층형 표시 */}
            {categories.filter(c => !c.parentCategoryNo).map(cat => (
              <React.Fragment key={cat.categoryNo}>
                <option value={cat.categoryNo}>{cat.categoryName}</option>
                {/* 소분류 렌더링 */}
                {categories.filter(sub => sub.parentCategoryNo === cat.categoryNo).map(sub => (
                  <option key={sub.categoryNo} value={sub.categoryNo}>
                    &nbsp;&nbsp;└ {sub.categoryName}
                  </option>
                ))}
              </React.Fragment>
            ))}
          </FilterSelect>

          {/* 상태 선택 */}
          <FilterSelect
            value={selectedStatus}
            onChange={handleFilterChange(setSelectedStatus)}
          >
            <option value="">전체 상태</option>
            {statusOptions.map(opt => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </FilterSelect>
        </FilterContainer>

        {/* --- 상품 테이블 --- */}
        <TableWrapper>
          <Table>
            <thead>
              <tr>
                <Th style={{ width: '60px' }}>ID</Th>
                <Th style={{ width: '80px' }}>이미지</Th>
                <Th>상품명</Th>
                <Th style={{ width: '120px' }}>카테고리</Th>
                <Th style={{ width: '100px' }}>가격</Th>
                <Th style={{ width: '80px' }}>재고</Th>
                <Th style={{ width: '80px' }}>상태</Th>
                <Th style={{ width: '120px' }}>관리</Th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                // 로딩 중일 때 테이블 바디 안에 스피너 표시
                <tr>
                  <Td colSpan="8" style={{ textAlign: 'center', padding: '50px' }}>
                    <Spinner />
                  </Td>
                </tr>
              ) : products.length > 0 ? (
                products.map((product) => (
                  <tr key={product.prdNo}>
                    <Td>{product.prdNo}</Td>
                    <Td>
                      <ProductImage
                        src={product.imageUrl || '/placeholder.png'}
                        alt="상품"
                        onError={(e) => e.target.src = '/placeholder.png'}
                      />
                    </Td>
                    <Td style={{ fontWeight: 'bold' }}>{product.prdName}</Td>
                    <Td>{product.categoryName}</Td>
                    <Td>{product.prdPrice.toLocaleString()}원</Td>
                    <Td>{product.stock}개</Td>
                    <Td>
                      <StatusTag $status={product.status}>
                        {product.status}
                      </StatusTag>
                    </Td>
                    <Td>
                      <EditLink to={`/admin/product/edit/${product.prdNo}`}>수정</EditLink>
                      <DeleteButton onClick={() => handleDelete(product)}>삭제</DeleteButton>
                    </Td>
                  </tr>
                ))
              ) : (
                <tr>
                  <Td colSpan="8" style={{ textAlign: 'center', padding: '50px', color: '#888' }}>
                    검색 결과가 없습니다.
                  </Td>
                </tr>
              )}
            </tbody>
          </Table>
        </TableWrapper>

        {/* 페이지네이션*/}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={(page) => setCurrentPage(page)}
        />

      </Content>
    </>
  );
}

export default AdminProductList;