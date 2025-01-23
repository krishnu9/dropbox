import https from "node:https";

export const getSignedUrl = async (path: string, fileName: string, fileType: string, token: string) =>
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/files/sign-s3`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `${token}`
        },
        body: JSON.stringify({ path, fileName, fileType })
    }).then(res => res.json())
        .then(data => {
            console.log(data);
            return data;
        })
        .catch(err => {
            console.error(err);
        });

