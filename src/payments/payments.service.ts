import { Injectable } from '@nestjs/common';
import { CreatePaymentDto } from './dto/create-payment.dto';
import * as dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import axios from 'axios';
import { supabase } from './supabase';

dotenv.config();

@Injectable()
export class PaymentsService {
  async create(createPaymentDto: CreatePaymentDto) {
    const username = process.env.MPESA_CONSUMER_KEY;
    const password = process.env.MPESA_CONSUMER_SECRET;
    const BusinessShortCode = Number(process.env.MPESA_SHORTCODE);
    const supabase = createClient(
      process.env.VITE_PROJECT_URL,
      process.env.VITE_API_KEY,
    );
    const tokenUrl =
      'https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials';

    const initiateUrl =
      'https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest';

    const tokenHeaders = {
      Authorization: `Basic ${btoa(`${username}:${password}`)}`,
    };
    try {
      const tokenResponse = await axios.get(tokenUrl, {
        headers: tokenHeaders,
      });
      const access_token = tokenResponse.data.access_token;

      const now = new Date();
      const year = String(now.getFullYear()).padStart(4, '0');
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const day = String(now.getDate()).padStart(2, '0');
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const seconds = String(now.getSeconds()).padStart(2, '0');
      const timestamp = `${year}${month}${day}${hours}${minutes}${seconds}`;

      const Password = btoa(
        `${BusinessShortCode}bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919${timestamp}`,
      );

      const initiatePayment = {
        BusinessShortCode: BusinessShortCode,
        Password,
        Timestamp: timestamp,
        TransactionType: 'CustomerPayBillOnline',
        Amount: 1,
        PartyA: process.env.MPESA_PHONE_NUMBER,
        PartyB: BusinessShortCode,
        PhoneNumber: createPaymentDto.phoneNumber,
        CallBackURL:
          'https://webpap-f8025.uc.r.appspot.com/payments/stk-callback',
        AccountReference: 'Webpap For dripventory',
        TransactionDesc: 'Payment for order',
      };

      await axios.post(initiateUrl, initiatePayment, {
        headers: { Authorization: `Bearer ${access_token}` },
      });

      let payLoad;

      const channels = supabase
        .channel('custom-insert-channel')
        .on(
          'postgres_changes',
          { event: 'INSERT', schema: 'public', table: 'stk_callbacks' },
          (payload) => {
            console.log('Change received!', payload);
            payLoad = payload;
          },
        )
        .subscribe();

      if (payLoad) return 'This action adds a new payment';
    } catch (error) {
      return error;
    }
  }

  async handleStkCallback(paymentCallbackDto) {
    await supabase
      .from('stk_callbacks')
      .insert([paymentCallbackDto.Body.stkCallback]);
    return 'ok';
  }
}
