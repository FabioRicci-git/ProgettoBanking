import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { BankingApiService, BANKING_API_BASE_URL } from './servizio';

describe('BankingApiService', () => {
  let service: BankingApiService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting(), BankingApiService],
    });
    service = TestBed.inject(BankingApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('getBalance should GET /accounts/:id/balance', () => {
    service.getBalance('1').subscribe((res) => {
      expect(res.balance).toBe(100);
    });

    const req = httpMock.expectOne(`${BANKING_API_BASE_URL}/accounts/1/balance`);
    expect(req.request.method).toBe('GET');
    req.flush({ account_id: 1, currency: 'EUR', balance: 100 });
  });
});
