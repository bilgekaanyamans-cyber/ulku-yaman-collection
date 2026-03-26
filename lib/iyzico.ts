// ─── iyzico Ödeme Yardımcıları ───────────────────────────────
// Docs: https://dev.iyzipay.com/

const Iyzipay = require("iyzipay");

const iyzipay = new Iyzipay({
  apiKey: process.env.IYZICO_API_KEY!,
  secretKey: process.env.IYZICO_SECRET_KEY!,
  uri: process.env.IYZICO_BASE_URL!,
});

type PaymentInput = {
  orderId: string;
  orderNumber: string;
  price: number;         // TL cinsinden toplam
  paidPrice: number;     // Taksit farkı dahil toplam
  installment: number;
  card: {
    holderName: string;
    number: string;
    expireMonth: string;
    expireYear: string;
    cvc: string;
  };
  buyer: {
    id: string;
    name: string;
    surname: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    district: string;
    zipCode: string;
    ip: string;
  };
  items: {
    id: string;
    name: string;
    price: string;
    category: string;
  }[];
  callbackUrl: string;
};

// ─── 3D Secure ile ödeme başlat ──────────────────────────────

export function initializeThreeDS(input: PaymentInput): Promise<any> {
  return new Promise((resolve, reject) => {
    const request = {
      locale: "tr",
      conversationId: input.orderId,
      price: input.price.toFixed(2),
      paidPrice: input.paidPrice.toFixed(2),
      currency: "TRY",
      installment: input.installment,
      basketId: input.orderNumber,
      paymentChannel: "WEB",
      paymentGroup: "PRODUCT",
      callbackUrl: input.callbackUrl,

      paymentCard: {
        cardHolderName: input.card.holderName,
        cardNumber: input.card.number.replace(/\s/g, ""),
        expireMonth: input.card.expireMonth,
        expireYear: input.card.expireYear,
        cvc: input.card.cvc,
        registerCard: 0,
      },

      buyer: {
        id: input.buyer.id,
        name: input.buyer.name,
        surname: input.buyer.surname,
        gsmNumber: input.buyer.phone,
        email: input.buyer.email,
        identityNumber: "11111111111", // TC Kimlik (zorunlu alan, test için sabit)
        registrationAddress: input.buyer.address,
        ip: input.buyer.ip,
        city: input.buyer.city,
        country: "Turkey",
        zipCode: input.buyer.zipCode,
      },

      shippingAddress: {
        contactName: `${input.buyer.name} ${input.buyer.surname}`,
        city: input.buyer.city,
        country: "Turkey",
        address: input.buyer.address,
        zipCode: input.buyer.zipCode,
      },

      billingAddress: {
        contactName: `${input.buyer.name} ${input.buyer.surname}`,
        city: input.buyer.city,
        country: "Turkey",
        address: input.buyer.address,
        zipCode: input.buyer.zipCode,
      },

      basketItems: input.items.map((item) => ({
        id: item.id,
        name: item.name,
        category1: item.category,
        itemType: "PHYSICAL",
        price: item.price,
      })),
    };

    iyzipay.threedsInitialize.create(request, (err: any, result: any) => {
      if (err) reject(err);
      else resolve(result);
    });
  });
}

// ─── 3D Secure sonrası ödeme tamamla ─────────────────────────

export function completeThreeDS(paymentId: string, conversationId?: string): Promise<any> {
  return new Promise((resolve, reject) => {
    const request: any = {
      locale: "tr",
      paymentId,
    };
    if (conversationId) request.conversationId = conversationId;

    iyzipay.threedsPayment.create(request, (err: any, result: any) => {
      if (err) reject(err);
      else resolve(result);
    });
  });
}

// ─── BIN sorgulama (taksit oranları) ─────────────────────────

export function checkInstallments(binNumber: string, price: number): Promise<any> {
  return new Promise((resolve, reject) => {
    const request = {
      locale: "tr",
      binNumber: binNumber.replace(/\s/g, "").substring(0, 6),
      price: price.toFixed(2),
    };

    iyzipay.installmentInfo.retrieve(request, (err: any, result: any) => {
      if (err) reject(err);
      else resolve(result);
    });
  });
}

// ─── İptal / İade ────────────────────────────────────────────

export function refundPayment(paymentTransactionId: string, price: number, ip: string): Promise<any> {
  return new Promise((resolve, reject) => {
    const request = {
      locale: "tr",
      paymentTransactionId,
      price: price.toFixed(2),
      currency: "TRY",
      ip,
    };

    iyzipay.refund.create(request, (err: any, result: any) => {
      if (err) reject(err);
      else resolve(result);
    });
  });
}
