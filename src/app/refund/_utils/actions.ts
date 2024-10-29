"use server";

const BASEURL = process.env.BASEURL;

export const createRefund = async (data: any, apiKey: string) => {
    try {
        
        const response = await fetch(`${BASEURL}/refund/create-a-request`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "x-api-key": apiKey || "",
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


