import { Injectable } from '@nestjs/common';
import axios, { AxiosResponse } from 'axios';

@Injectable()
export class PaymentsService {
  async processPayment(customer: { customerPhone: 'string'; amount: number }) {
    const username = 'EOuKjg2TA8yfJ2ppA7KGrgHOl8xM6OPR';
    const password = 'DXDYUpLGwE7e2x8J';
    const credentials = `${username}:${password}`;
    const base64Credentials = btoa(credentials);

    const auth: AxiosResponse<{ access_token: string }> = await axios.get(
      'https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials',
      {
        headers: {
          Authorization: `Basic ${base64Credentials}`,
        },
      },
    );

    const businessShortCode = 174379;
    const now = new Date();
    const year = String(now.getFullYear()).padStart(4, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');

    const timestamp = `${year}${month}${day}${hours}${minutes}${seconds}`;
    const access_token =
      'bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919';

    const Password = btoa(
      `${businessShortCode}:${auth.data.access_token}:${timestamp}`,
    );

    const initiatePayment = {
      BusinessShortCode: businessShortCode,
      Password,
      Timestamp: timestamp,
      TransactionType: 'CustomerPayBillOnline',
      Amount: customer.amount,
      PartyA: customer.customerPhone,
      PartyB: businessShortCode,
      PhoneNumber: customer.customerPhone,
      CallBackURL: 'https://mydomain.com/pat',
      AccountReference: 'Webpap',
      TransactionDesc: 'Payment for order',
    };
    try {
      const response = await axios.post(
        'https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest',
        initiatePayment,
        { headers: { Authorization: `Bearer ${auth.data.access_token}` } },
      );
    } catch (e) {
      console.log(e.response.data);
    }
  }
}
