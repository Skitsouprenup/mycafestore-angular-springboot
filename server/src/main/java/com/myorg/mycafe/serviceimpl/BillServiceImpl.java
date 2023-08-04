package com.myorg.mycafe.serviceimpl;

import com.google.gson.Gson;
import com.itextpdf.text.*;
import com.itextpdf.text.pdf.PdfPCell;
import com.itextpdf.text.pdf.PdfPTable;
import com.itextpdf.text.pdf.PdfWriter;
import com.myorg.mycafe.constants.CafeConstants;
import com.myorg.mycafe.dao.BillDao;
import com.myorg.mycafe.jwt.JwtFilter;
import com.myorg.mycafe.models.Bill;
import com.myorg.mycafe.service.BillService;
import com.myorg.mycafe.utils.CafeUtilities;
import com.myorg.mycafe.wrapper.billwrapper.ProductDetails;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.io.File;
import java.io.FileOutputStream;
import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Stream;

@Slf4j
@Service
@SuppressWarnings({"unchecked"})
public class BillServiceImpl implements BillService {

    @Autowired
    JwtFilter jwtFilter;

    @Autowired
    BillDao billDao;

    @Override
    public ResponseEntity<String> generateReport(Map<String, String> requestMap) {
        try {
            String fileName;
            if(validateRequestMap(requestMap.keySet()) && requestMap.get("isGenerate") != null) {
                if(!Boolean.parseBoolean(requestMap.get("isGenerate"))) {
                    fileName = requestMap.get("uuid");
                }
                else {
                    fileName = CafeUtilities.getUUID();
                    requestMap.put("uuid", fileName);
                    generateBill(requestMap);
                }

                String data =
                        "Name: " + requestMap.get("name") + "\n" +
                        "Contact Number: " + requestMap.get("contactNumber") + "\n" +
                        "Email: " + requestMap.get("email") + "\n" +
                        "Payment Method: " + requestMap.get("paymentMethod");

                //
                StringBuilder builder = new StringBuilder();
                Object response = checkReportDir(fileName, builder, true);
                if(response != null)
                    return (ResponseEntity<String>) response;

                Document document = new Document();
                PdfWriter.getInstance(document, new FileOutputStream(builder.toString()));
                document.open();

                addDocumentBorder(document);
                Paragraph header = new Paragraph("Cafe Management System", getFont("header"));
                header.setAlignment(Element.ALIGN_CENTER);
                document.add(header);

                Paragraph clientInfo = new Paragraph(data+"\n\n", getFont("data"));
                document.add(clientInfo);

                PdfPTable table = new PdfPTable(5);
                table.setWidthPercentage(100);
                addTableHeader(table);

                for(ProductDetails details :
                        productDetailsToJSONArray(requestMap.get("productDetails"))) {
                    addTableRow(table, details);
                }
                document.add(table);

                String footer = "Total: " + requestMap.get("total") + "\n" +
                                "Thank you for using our service! Come again anytime!";
                Paragraph footerPdf = new Paragraph(footer, getFont("data"));
                document.add(footerPdf);
                document.close();

                return new ResponseEntity<>("{\"uuid\":\""+fileName+"\"}", HttpStatus.CREATED);
            }
            String responseBody = "{\"message\":\""+ "Missing fields in request body." +"\"}";
            return CafeUtilities.getResponse(responseBody, HttpStatus.BAD_REQUEST);
        }
        catch(Exception e) {
            log.error("Error: {}", (Object[]) e.getStackTrace());
        }

        String responseBody = "{\"message\": \""+ CafeConstants.STATUS_500 +"\"}";
        return CafeUtilities.getResponse(responseBody, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @Override
    public ResponseEntity<List<Bill>> getBills() {
        try {
            List<Bill> billList;

            if(jwtFilter.hasRole("admin")) {
                billList = billDao.getBills();
            }
            else {
                billList = billDao.getBillsByUsername(jwtFilter.getCurrentUser());
            }

            return new ResponseEntity<>(billList, HttpStatus.OK);
        }
        catch(Exception e) {
            log.error("Error: {}", (Object[]) e.getStackTrace());
        }

        return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @Override
    public ResponseEntity<byte[]> getBillPdf(Map<String, String> requestMap) {
        try {
            if(!requestMap.containsKey("uuid"))
                return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST);

            StringBuilder builder = new StringBuilder();
            Object response = checkReportDir(requestMap.get("uuid"), builder, false);
            if(response != null)
                return (ResponseEntity<byte[]>) response;

            File filePath = new File(builder.toString());

            if(filePath.exists()) {
                return new ResponseEntity<>(CafeUtilities.getFileBytes(filePath), HttpStatus.OK);
            }
            else {
                /*
                * isGenerate = false means that bill info doesn't need to be saved to database.
                * The purpose of the logic here is to re-create bill that already exists in
                * database
                * */
                requestMap.put("isGenerate", "false");
                ResponseEntity<String> report = generateReport(requestMap);

                if(report.getStatusCode() != HttpStatus.CREATED)
                    return new ResponseEntity<>(null, report.getStatusCode());

                return new ResponseEntity<>(CafeUtilities.getFileBytes(filePath), HttpStatus.CREATED);
            }
        }
        catch(Exception e) {
            log.error("Error: {}", (Object[]) e.getStackTrace());
        }

        return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @Override
    public ResponseEntity<String> deleteBill(Integer id) {
        try {
            Optional<Bill> billOpt = billDao.findById((long) id);

            if(billOpt.isPresent()) {
                billDao.deleteById((long) id);

                StringBuilder builder = new StringBuilder();
                Object response = checkReportDir(billOpt.get().getUuid(), builder, true);
                if(response != null){
                    return (ResponseEntity<String>) response;
                }
                else {
                    File file = new File(builder.toString());
                    if(!file.delete())
                        log.error("File " + file.getName() + " can't be deleted!");
                }

                String responseBody = "{\"message\": \""+ "Bill record deleted." +"\"}";
                return CafeUtilities.getResponse(responseBody, HttpStatus.OK);
            }
            else {
                String responseBody = "{\"message\": \""+ "Bill record doesn't exist." +"\"}";
                return CafeUtilities.getResponse(responseBody, HttpStatus.BAD_REQUEST);
            }
        }
        catch(Exception e) {
            log.error("Error: {}", (Object[]) e.getStackTrace());
        }

        String responseBody = "{\"message\": \""+ CafeConstants.STATUS_500 +"\"}";
        return CafeUtilities.getResponse(responseBody, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    /**********/


    private void addTableRow(PdfPTable table, ProductDetails details) {
        table.addCell(details.getName());
        table.addCell(details.getCategory());
        table.addCell(details.getQuantity());
        table.addCell(details.getPrice());
        table.addCell(details.getTotal());
    }

    private ProductDetails[] productDetailsToJSONArray(String data){
        Gson gson = new Gson();
        return gson.fromJson(data, ProductDetails[].class);
    }

    private void addTableHeader(PdfPTable table) {
        Stream.of("Name", "Category", "Quantity", "Price", "Sub Total")
                .forEach(columnHeader -> {
                    PdfPCell cell = new PdfPCell();
                    cell.setBackgroundColor(BaseColor.LIGHT_GRAY);
                    cell.setBorderWidth(1);
                    cell.setPhrase(new Phrase(columnHeader));
                    cell.setHorizontalAlignment(Element.ALIGN_CENTER);
                    cell.setVerticalAlignment(Element.ALIGN_CENTER);
                    table.addCell(cell);
                });
    }

    private Font getFont(String type) {

        return switch (type) {
            case "header" -> FontFactory.getFont(FontFactory.COURIER_BOLDOBLIQUE, 16, BaseColor.BLACK);
            case "data" -> FontFactory.getFont(FontFactory.TIMES_ROMAN, 12, BaseColor.BLACK);
            default -> new Font();
        };
    }

    private void addDocumentBorder(Document document) throws DocumentException {
        /*
        * Note: 2D Coordinates of itext core Rectangle work differently from typical
        * coordinate system. In here, the coordinate system is the opposite of
        * typical coordinate system. For example, in java swing GUI, positive y
        * goes down the screen and negative y goes up. In here, positive y goes
        * up and negative y goes down.
        *
        * */
        Rectangle rect = new Rectangle(
                document.getPageSize().getLeft() + 10,
                document.getPageSize().getBottom() + 10,
                document.getPageSize().getRight() - 10,
                document.getPageSize().getTop() - 10);

        rect.enableBorderSide(Rectangle.LEFT);
        rect.enableBorderSide(Rectangle.RIGHT);
        rect.enableBorderSide(Rectangle.TOP);
        rect.enableBorderSide(Rectangle.BOTTOM);

        rect.setBorderColor(BaseColor.BLACK);
        rect.setBorderWidth(1);

        document.add(rect);
    }

    private void generateBill(Map<String, String> requestMap){
        Bill bill = new Bill();
        bill.setUuid(requestMap.get("uuid"));
        bill.setName(requestMap.get("name"));
        bill.setEmail(requestMap.get("email"));
        bill.setContactNumber(requestMap.get("contactNumber"));
        bill.setPaymentMethod(requestMap.get("paymentMethod"));
        bill.setTotal(new BigDecimal(requestMap.get("total")));
        bill.setProductDetails(requestMap.get("productDetails"));
        bill.setCreatedBy(jwtFilter.getCurrentUser());

        billDao.save(bill);
    }

    private boolean validateRequestMap(Set<String> keys) {
        boolean result = true;

        String[] requiredKeys = new String[]{
                "name", "contactNumber", "email",
                "paymentMethod", "productDetails", "total"};

        for(String key : requiredKeys) {
            if(!keys.contains(key)) {
                result = false;
                break;
            }
        }

        return result;
    }

    private ResponseEntity<Object> checkReportDir(
            String fileName, StringBuilder targetPath, boolean isString) {
        File file = new File("reports");
        if(!file.exists())
            if(!file.mkdir()) {
                log.error("Can't create reports directory!");
                String responseBody =
                        "{\"message\":\""+"\"Internal Server Error. Contact Admin for details.\""+"\"}";
                if(isString)
                    return new ResponseEntity<>(responseBody, HttpStatus.INTERNAL_SERVER_ERROR);
                else return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
            }

        if(file.exists()){
            targetPath.
                    append(file.getAbsolutePath()).
                    append(File.separator).
                    append(fileName).
                    append(".pdf");
            return null;
        }
        else {
            log.error("reports directory doesn't exists!");
            String responseBody =
                    "{\"message\":\""+"\"Internal Server Error. Contact Admin for details.\""+"\"}";
            if(isString)
                return new ResponseEntity<>(responseBody, HttpStatus.INTERNAL_SERVER_ERROR);
            else return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
