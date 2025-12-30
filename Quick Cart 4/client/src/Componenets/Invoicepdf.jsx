import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";



const sellerInfo = {
  name: "Your Business Name",
  address: "1234 Business St, City, Country",
  phone: "+1 234 567 890",
  email: "contact@business.com",
};

const styles = StyleSheet.create({
  page: {
    fontFamily: "Helvetica",
    fontSize: 12,
    padding: 30,
    lineHeight: 1.5,
  },

  headerWrap: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 25,
  },
  logo: {
    width: 80,
    height: 80,
  },
  invoiceTitle: {
    fontSize: 28,
    fontWeight: "bold",
    textTransform: "uppercase",
    display: "flex",
    textAlign: " center",
    justifyContent: "center",
    alignItems: "center"
  },

  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 30,
  },
  col: {
    width: "33%",
  },
  rightAlign: {
    textAlign: "right",
  },
  titleBold: {
    fontWeight: "bold",
    marginBottom: 4,
  },


  table: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#000",
    marginBottom: 20,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#F15A24",
  },
  th: {
    flex: 1,
    padding: 8,
    color: "white",
    fontWeight: "bold",
    fontSize: 11,
    borderRightWidth: 1,
    borderRightColor: "white",
    textAlign: "center",
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#000",
  },
  td: {
    flex: 1,
    padding: 8,
    fontSize: 11,
    borderRightWidth: 1,
    borderRightColor: "#ccc",
    textAlign: "center",
  },


  totalsBox: {
    width: "40%",
    alignSelf: "flex-end",
    marginTop: 10,
  },
  totalsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  totalFinal: {
    backgroundColor: "#F15A24",
    color: "white",
    padding: 10,
    marginTop: 10,
    fontSize: 14,
    textAlign: "right",
    fontWeight: "bold",
  },


  terms: {
    marginTop: 40,
  },
  termsTitle: {
    fontWeight: "bold",
    marginBottom: 4,
  },
});

export const Invoicepdf = ({ order }) => {
  if (!order) {
    return (
      <Document>
        <Page style={styles.page}>
          <Text>No order data provided</Text>
        </Page>
      </Document>
    );
  }

  const items = order.items || [];

  const subtotal = items.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );
  const taxPercent = order.taxPercent ?? 2;
  const taxAmount = (subtotal * taxPercent) / 100;
  const fees = order.fees ?? 0;
  const discounts = order.discounts ?? 0;
  const total = subtotal + taxAmount + fees - discounts;

  return (
    <Document>
      <Page size="A4" style={styles.page}>


        <View style={styles.headerWrap}>
          <Image src={logo} style={styles.logo} />
          <Text style={styles.invoiceTitle}>INVOICE</Text>
        </View>

        <View style={styles.infoRow}>

          <View style={styles.col}>
            <Text style={styles.titleBold}>{sellerInfo.name}</Text>
            <Text>{sellerInfo.address}</Text>
            <Text>{sellerInfo.phone}</Text>
            <Text>{sellerInfo.email}</Text>
          </View>


          <View style={styles.col}>
            <Text style={styles.titleBold}>Bill to:</Text>
            <Text>{order.address.fullName}</Text>
            <Text>{order.address.address}</Text>
            <Text>{order.address.phone}</Text>
            <Text>{order.address.state}</Text>
          </View>


          <View style={[styles.col, styles.rightAlign]}>
            <Text style={styles.titleBold}>
              Invoice number: {order.orderid}
            </Text>
            <Text style={styles.titleBold}>
              Invoice date: {new Date(order.createdAt).toLocaleDateString()}
            </Text>
            <Text style={styles.titleBold}>
              Payment due: {new Date(order.createdAt).toLocaleDateString()}
            </Text>
          </View>
        </View>

        {/* TABLE */}
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={styles.th}>Item</Text>
            <Text style={styles.th}>Quantity</Text>
            <Text style={styles.th}>Price per unit</Text>
            <Text style={styles.th}>Amount</Text>
          </View>

          {items.map((item, idx) => (
            <View key={idx} style={styles.tableRow}>
              <Text style={styles.td}>{item.name}</Text>
              <Text style={styles.td}>{item.quantity}</Text>
              <Text style={styles.td}>{item.price.toFixed(2)}</Text>
              <Text style={styles.td}>
                {(item.price * item.quantity).toFixed(2)}
              </Text>
            </View>
          ))}
        </View>


        <View style={styles.totalsBox}>
          <View style={styles.totalsRow}>
            <Text>Subtotal</Text>
            <Text>{subtotal.toFixed(2)}</Text>
          </View>

          <View style={styles.totalsRow}>
            <Text>Tax ({taxPercent}%)</Text>
            <Text>{taxAmount.toFixed(2)}</Text>
          </View>

          <View style={styles.totalsRow}>
            <Text>Fees</Text>
            <Text>{fees.toFixed(2)}</Text>
          </View>
          <View style={styles.totalsRow}>
            <Text>Discounts</Text>
            <Text>{discounts.toFixed(2)}</Text>
          </View>

          <Text style={styles.totalFinal}>TOTAL {total.toFixed(2)}</Text>
        </View>


        <View style={styles.terms}>
          <Text style={styles.termsTitle}>Terms and conditions</Text>
          <Text>1 year warnty but bill is compulsory to get waranty</Text>
          <Text>Your product is delivery in 7 estimate days</Text>
        </View>

      </Page>
    </Document>
  );
};