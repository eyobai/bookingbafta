import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, ScrollView } from "react-native";
import moment from "moment";
import Date from "../../components/Date";
import SalonBookingApp from "../../components/SalonBookingApp";

const Appointments = ({ onSelectDate }) => {
  const [dates, setDates] = useState([]);
  const [currentMonth, setCurrentMonth] = useState();
  const [selected, setSelected] = useState(moment().format("YYYY-MM-DD"));

  const generateDates = () => {
    const startDate = moment().startOf("day");
    const generatedDates = [];
    for (let i = 0; i < 7; i++) {
      generatedDates.push(startDate.clone().add(i, "days"));
    }
    setDates(generatedDates);
    setCurrentMonth(startDate.format("MMMM"));
  };

  const handleDateSelect = (selectedDate) => {
    setSelected(selectedDate);
    console.log("Selected Date:", selectedDate);
  };

  useEffect(() => {
    generateDates();
  }, []);

  return (
    <>
      <View style={styles.centered}>
        <Text style={styles.title}>{currentMonth}</Text>
      </View>
      <View style={styles.dateSection}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.dateContainer}>
            {dates.map((date, index) => (
              <Date
                key={index}
                date={date}
                onSelectDate={handleDateSelect}
                selected={selected}
              />
            ))}
          </View>
        </ScrollView>
        <SalonBookingApp selectedDate={selected} />
      </View>
    </>
  );
};

export default Appointments;

const styles = StyleSheet.create({
  centered: {
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  dateSection: {
    width: "100%",
    padding: 20,
  },
  dateContainer: {
    flexDirection: "row",
  },
});
