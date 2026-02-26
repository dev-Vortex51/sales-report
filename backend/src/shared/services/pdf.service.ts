import PDFDocument from "pdfkit";

interface ReceiptPdfLineItem {
  description: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
}

interface ReceiptPdfData {
  receiptNumber: string;
  date: Date;
  businessName: string;
  businessAddress: string;
  branchName: string;
  cashierName: string;
  customerName: string;
  currency: string;
  items: ReceiptPdfLineItem[];
  subtotal: number;
  taxAmount: number;
  total: number;
  footer: string;
}

interface DailySummaryData {
  date: string;
  transaction_count: number;
  total_revenue: number;
  total_tax: number;
  average_basket: number;
}

interface WeeklyTopItem {
  description: string;
  quantity_sold: number;
  total_revenue: number;
}

interface WeeklyReportData {
  week_start: string;
  week_end: string;
  daily_breakdown: DailySummaryData[];
  top_items: WeeklyTopItem[];
  totals: {
    transaction_count: number;
    total_revenue: number;
    total_tax: number;
    average_basket: number;
  };
}

function formatCurrency(value: number, currency: string) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

function buildPdf(draw: (doc: PDFKit.PDFDocument) => void): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({
      margin: 40,
      size: "A4",
      bufferPages: true,
      info: {
        Producer: "Sales Management Backend",
      },
    });

    const chunks: Buffer[] = [];
    doc.on("data", (chunk) => chunks.push(chunk as Buffer));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);

    draw(doc);
    doc.end();
  });
}

export function renderReceiptPdf(data: ReceiptPdfData): Promise<Buffer> {
  return buildPdf((doc) => {
    doc.fontSize(20).font("Helvetica-Bold").text(data.businessName);
    doc
      .moveDown(0.2)
      .fontSize(10)
      .font("Helvetica")
      .fillColor("#374151")
      .text(data.businessAddress || "-")
      .text(`Branch: ${data.branchName}`)
      .text(`Cashier: ${data.cashierName}`)
      .text(`Receipt #: ${data.receiptNumber}`)
      .text(`Date: ${data.date.toISOString()}`)
      .text(`Customer: ${data.customerName}`)
      .fillColor("black");

    doc.moveDown();
    doc.font("Helvetica-Bold").fontSize(11).text("Items");
    doc
      .moveTo(40, doc.y + 3)
      .lineTo(555, doc.y + 3)
      .stroke("#D1D5DB");
    doc.moveDown(0.6);

    data.items.forEach((item) => {
      const left = `${item.description} x${item.quantity}`;
      const right = `${formatCurrency(item.unitPrice, data.currency)}  |  ${formatCurrency(item.lineTotal, data.currency)}`;
      doc.font("Helvetica").fontSize(10).text(left, 40, doc.y, { width: 330 });
      doc
        .font("Helvetica")
        .fontSize(10)
        .text(right, 380, doc.y - 12, { width: 175, align: "right" });
      doc.moveDown(0.8);
    });

    doc.moveDown();
    doc.moveTo(300, doc.y).lineTo(555, doc.y).stroke("#D1D5DB");
    doc.moveDown(0.6);

    doc
      .font("Helvetica")
      .fontSize(10)
      .text("Subtotal", 340, doc.y, { width: 90 })
      .text(formatCurrency(data.subtotal, data.currency), 430, doc.y - 12, {
        width: 125,
        align: "right",
      });
    doc
      .text("Tax", 340, doc.y, { width: 90 })
      .text(formatCurrency(data.taxAmount, data.currency), 430, doc.y - 12, {
        width: 125,
        align: "right",
      });
    doc
      .font("Helvetica-Bold")
      .fontSize(12)
      .text("Total", 340, doc.y + 2, { width: 90 })
      .text(formatCurrency(data.total, data.currency), 430, doc.y - 12, {
        width: 125,
        align: "right",
      });

    doc.moveDown(2);
    doc
      .font("Helvetica")
      .fontSize(10)
      .fillColor("#374151")
      .text(data.footer || "Thank you for your business.", {
        align: "center",
      })
      .fillColor("black");
  });
}

export function renderWeeklyReportPdf(
  report: WeeklyReportData,
  currency: string,
): Promise<Buffer> {
  return buildPdf((doc) => {
    doc
      .font("Helvetica-Bold")
      .fontSize(18)
      .text(`Weekly Report: ${report.week_start} to ${report.week_end}`);

    doc.moveDown();
    doc.font("Helvetica-Bold").fontSize(12).text("Totals");
    doc
      .font("Helvetica")
      .fontSize(10)
      .text(`Transactions: ${report.totals.transaction_count}`)
      .text(`Revenue: ${formatCurrency(report.totals.total_revenue, currency)}`)
      .text(`Tax: ${formatCurrency(report.totals.total_tax, currency)}`)
      .text(
        `Average Basket: ${formatCurrency(report.totals.average_basket, currency)}`,
      );

    doc.moveDown();
    doc.font("Helvetica-Bold").fontSize(12).text("Daily Breakdown");
    doc.moveDown(0.4);

    report.daily_breakdown.forEach((day) => {
      doc
        .font("Helvetica")
        .fontSize(10)
        .text(
          `${day.date}  |  tx ${day.transaction_count}  |  revenue ${formatCurrency(day.total_revenue, currency)}  |  tax ${formatCurrency(day.total_tax, currency)}  |  avg ${formatCurrency(day.average_basket, currency)}`,
        );
    });

    doc.moveDown();
    doc.font("Helvetica-Bold").fontSize(12).text("Top Items");
    doc.moveDown(0.4);

    report.top_items.forEach((item, index) => {
      doc
        .font("Helvetica")
        .fontSize(10)
        .text(
          `${index + 1}. ${item.description} — qty ${item.quantity_sold}, revenue ${formatCurrency(item.total_revenue, currency)}`,
        );
    });
  });
}

export function renderDailySummaryPdf(
  summary: DailySummaryData,
  currency: string,
): Promise<Buffer> {
  return buildPdf((doc) => {
    doc
      .font("Helvetica-Bold")
      .fontSize(18)
      .text(`Daily Summary: ${summary.date}`);

    doc.moveDown();
    doc
      .font("Helvetica")
      .fontSize(11)
      .text(`Transactions: ${summary.transaction_count}`)
      .text(`Total Revenue: ${formatCurrency(summary.total_revenue, currency)}`)
      .text(`Total Tax: ${formatCurrency(summary.total_tax, currency)}`)
      .text(
        `Average Basket: ${formatCurrency(summary.average_basket, currency)}`,
      );
  });
}
