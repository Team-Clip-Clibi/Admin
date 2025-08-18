import { SliceResponse } from '@/apis/common/SliceResponse';

export class SliceUtils<T> {
  private sliceResponse: SliceResponse<T> | undefined;

  constructor(sliceResponse: SliceResponse<T> | undefined) {
    this.sliceResponse = sliceResponse;
  }

  get isValid(): boolean {
    return !!this.sliceResponse && !this.sliceResponse.empty;
  }

  get content(): T[] {
    return this.sliceResponse?.content || [];
  }

  get currentPage(): number {
    return this.sliceResponse?.pageable.pageNumber || 0;
  }

  get pageSize(): number {
    return this.sliceResponse?.pageable.pageSize || 0;
  }

  get isFirstPage(): boolean {
    return this.sliceResponse?.first || false;
  }

  get isLastPage(): boolean {
    return this.sliceResponse?.last || false;
  }

  get hasPreviousPage(): boolean {
    return !this.isFirstPage;
  }

  get hasNextPage(): boolean {
    return !this.isLastPage;
  }

  get shouldShowPagination(): boolean {
    return this.isValid && this.pageSize > 0 && !this.isLastPage;
  }

  getPageNumbers(): number[] {
    if (!this.shouldShowPagination) {
      return [];
    }

    const currentPage = this.currentPage;
    const pages = [];
    
    // 현재 페이지 추가
    pages.push(currentPage);
    
    // 이전 페이지들 추가 (0부터 현재 페이지-1까지)
    for (let i = currentPage - 1; i >= 0; i--) {
      pages.unshift(i);
    }
    
    // 다음 페이지가 있다면 추가 (last가 false인 경우)
    if (!this.isLastPage) {
      pages.push(currentPage + 1);
    }
    
    return pages;
  }

  getPaginationState() {
    const pageNumbers = this.getPageNumbers();
    
    let totalPages = 1;
    
    if (this.sliceResponse) {
      if (this.isLastPage) {
        totalPages = this.currentPage + 1;
      } else {
        totalPages = this.currentPage + 2;
      }
    }
    
    return {
      pageNumbers,
      totalPages,
      isFirstPage: this.isFirstPage,
      isLastPage: this.isLastPage,
      showEllipsisAfter: false,
      showLastPage: false,
    };
  }

  getItemNumber(itemIndex: number): number {
    return this.currentPage * this.pageSize + itemIndex + 1;
  }

  get isEmpty(): boolean {
    return this.sliceResponse?.empty || false;
  }

  get isLoading(): boolean {
    return !this.sliceResponse;
  }

  static from<T>(sliceResponse: SliceResponse<T> | undefined): SliceUtils<T> {
    return new SliceUtils(sliceResponse);
  }
}
