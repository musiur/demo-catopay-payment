"use server";

const BASEURL = process.env.BASEURL;


export const A__GET__PaymentMethods = async (apiKey: string) => {
    try {
        if (!apiKey) {
            return {
                success: false,
                message: "API Key is not provided."
            }
        }
        const response = await fetch(`${BASEURL}/payment/methods`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "x-api-key": apiKey
            },
            cache: "no-store"
        })
        const result = await response.json();
        return result;
    } catch (error) {
        return {
            success: false,
            message: "Something went wrong!"
        }
    }
}


export const A__POST__CreatePaymentRequest = async (data: {
    amount: number,
    paymentMethodId: string,
    redirect_url: string,
    callback_url: string
}, apiKey: string) => {
    try {
        if (!apiKey) {
            return {
                success: false,
                message: "API Key is not provided."
            }
        }
        const response = await fetch(`${BASEURL}/payment/create`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "x-api-key": apiKey
            },
            body: JSON.stringify(data)
        })
        const result = await response.json();
        return result;
    } catch (error) {
        return {
            success: false,
            message: "Something went wrong!"
        }
    }
}