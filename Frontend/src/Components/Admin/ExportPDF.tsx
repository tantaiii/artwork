import { useEffect } from "react";
import { useAuth } from "../../secure/AuthContext.tsx";
import { AdminApiService } from "../../API/AdminAPI/GET.tsx";
import moment from "moment";

let generateReportFn: ((token: string) => Promise<void>) | null = null;
let isReady = false;

const createTable = (data: any[], headers: string[], dataKeys: string[]) => {
  if (!data || data.length === 0) {
    return `<p style="color: #999; text-align: center; padding: 16px;">No data available</p>`;
  }

  return `
    <table style="width: 100%; border-collapse: collapse; margin: 10px 0; font-size: 11px;">
      <thead>
        <tr style="background: #0b81ff; color: white;">
          ${headers.map((h) => `<th style="padding: 8px; border: 1px solid #ddd;">${h}</th>`).join("")}
        </tr>
      </thead>
      <tbody>
        ${data
          .map(
            (row) => `
          <tr>
            ${dataKeys
              .map((key) => {
                const val = row[key];
                let display = "";

                if (val === null || val === undefined) display = "";
                else if (key.includes("Date") || key.includes("At") || key.includes("date")) {
                  display = moment(val).format("YYYY-MM-DD HH:mm:ss");
                } else if (key === "price" || key === "amount") {
                  display = `$${Number(val).toFixed(2)}`;
                } else if (key === "status") {
                  display = val === true || val === 1 ? "Success" : "Failed";
                } else if (typeof val === "object") {
                  display = val._id || JSON.stringify(val);
                } else {
                  display = val.toString();
                }

                return `<td style="padding: 8px; border: 1px solid #ddd;">${display}</td>`;
              })
              .join("")}
          </tr>
        `
          )
          .join("")}
      </tbody>
    </table>
  `;
};

export const ExportPDF = () => {
  const { accessToken } = useAuth();

  useEffect(() => {
    if (!accessToken) {
      generateReportFn = null;
      isReady = false;
      return;
    }

    generateReportFn = async (token: string) => {
      try {
        const [users, payments, transactions] = await Promise.all([
          AdminApiService.getAllUsers(token),
          AdminApiService.GetListPaymentInThisMonth(token),
          AdminApiService.GetListTransactionInThisMonth(token),
        ]);

        const reportHtml = `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="UTF-8">
            <title>ArtHub Admin Report</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background: #f5f5f5; }
              .content { background: white; padding: 30px; max-width: 210mm; margin: auto; box-shadow: 0 0 10px rgba(0,0,0,0.1); }
              h1 { text-align: center; color: #333; font-size: 24px; margin-bottom: 5px; }
              h2 { color: #0b81ff; font-size: 18px; margin-top: 30px; page-break-before: always; }
              .section:first-child h2 { page-break-before: avoid; }
              .header { text-align: center; color: #666; font-size: 14px; margin-bottom: 20px; }
              table { width: 100%; border-collapse: collapse; margin: 15px 0; font-size: 11px; }
              th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
              th { background: #0b81ff; color: white; }
              @page { margin: 1.5cm; size: A4; }
              .no-print { display: none; }
              @media print {
                .no-print {
                  display: block;
                  position: fixed;
                  bottom: 20px;
                  right: 20px;
                  z-index: 1000;
                }
              }
            </style>
          </head>
          <body>
            <div class="content">
              <h1>ArtHub Administration Report</h1>
              <p class="header">Generated on: ${moment().format("YYYY-MM-DD HH:mm:ss")}</p>

              <div class="section">
                <h2>User List</h2>
                ${createTable(users || [], ["ID", "Email"], ["_id", "email"])}
              </div>

              <div class="section">
                <h2>Payments This Month</h2>
                ${createTable(
                  payments || [],
                  ["ID", "User", "Amount", "Date"],
                  ["_id", "userId", "amount", "dateCreated"]
                )}
              </div>

              <div class="section">
                <h2>Transactions This Month</h2>
                ${createTable(
                  transactions || [],
                  ["ID", "Seller", "Buyer", "Artwork", "Price", "Date"],
                  ["_id", "sellerID", "buyerID", "artworkID", "price", "dateToBuy"]
                )}
              </div>
            </div>

            <div class="no-print">
              <button onclick="window.print()" style="
                padding: 12px 24px;
                background: #0b81ff;
                color: white;
                border: none;
                border-radius: 4px;
                cursor: pointer;
                font-weight: bold;
                font-size: 14px;
              ">
                Save as PDF
              </button>
            </div>
          </body>
          </html>
        `;

        const win = window.open("", "_blank", "width=900,height=700");
        if (!win) throw new Error("Popup blocked. Please allow popups.");
        win.document.write(reportHtml);
        win.document.close();
        win.onload = () => setTimeout(() => win.print(), 800);
      } catch (err: any) {
        throw new Error(err.message || "Failed to generate report");
      }
    };

    isReady = true;
  }, [accessToken]);

  return null;
};

export const generateAdminReport = async (token: string) => {
  if (!isReady || !generateReportFn) {
    throw new Error("Report system is not ready. Please wait...");
  }
  if (!token) {
    throw new Error("Access token is missing. Please login.");
  }
  return generateReportFn(token);
};
