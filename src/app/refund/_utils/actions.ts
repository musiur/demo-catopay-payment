"use server";

const BASEURL = process.env.BASEURL;
const APIKEY = process.env.APIKEY;

export const createRefund = async (data: any) => {
    try {
        console.log(APIKEY)
        const response = await fetch(`${BASEURL}/refund/create-a-request`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "x-api-key": APIKEY || "",
            },
            body: JSON.stringify(data),
        });
        const result = await response.json();
        return result;
    } catch (error) {
        return {
            status: "error",
            message: "Failed to create refund",
        };
    }
};

export const getPaymentMethods = async () => {
    try {
        const response = await fetch(`${BASEURL}/payment/methods`, {
            headers: {
                "Content-Type": "application/json",
                "x-api-key": APIKEY || "",
            },
        });
        const result = await response.json();
        return result;
    } catch (error) {
        return {
            success: false,
            message: "Failed to get payment methods",
        };
    }
};

