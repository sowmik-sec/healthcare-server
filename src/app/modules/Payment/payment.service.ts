import axios from "axios";
import config from "../../../config";
import prisma from "../../../shared/prisma";
import { SSLService } from "../SSL/ssl.service";
import { PaymentStatus } from "../../../generated/prisma";
const initPayment = async (appointmentId: string) => {
  const paymentData = await prisma.payment.findFirstOrThrow({
    where: {
      appointmentId,
    },
    include: {
      appointment: {
        include: {
          patient: true,
        },
      },
    },
  });
  const initPaymentData = {
    amount: paymentData.amount,
    transactionId: paymentData.transactionId,
    name: paymentData.appointment.patient.name,
    email: paymentData.appointment.patient.email,
    address: paymentData.appointment.patient.address,
    phoneNumber: paymentData.appointment.patient.contactNumber,
  };
  const result = await SSLService.initPayment(initPaymentData);
  return {
    paymentUrl: result.GatewayPageURL,
  };
};

const validatePayment = async (payload: any) => {
  if (!payload || !payload.status || !(payload.status === "VALID")) {
    return {
      message: "Invalid payment",
    };
  }

  const response = await SSLService.validatePayment(payload);
  if (response?.status !== "VALID") {
    return {
      message: "Payment failed",
    };
  }

  await prisma.$transaction(async (tx) => {
    await tx.payment.updateMany({
      where: {
        transactionId: response.tran_id,
      },
      data: {
        status: PaymentStatus.PAID,
        paymentGatewayData: response,
      },
    });
  });
};

export const PaymentServices = {
  initPayment,
  validatePayment,
};
