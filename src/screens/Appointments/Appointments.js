import React, { useEffect, useState } from "react";
import {
  View,
  ScrollView,
  TouchableOpacity,
  Text,
  Image,
  StyleSheet,
  FlatList,
} from "react-native";
import moment from "moment";

const MyComponent = () => {
  const userId = "5EvMBnwPpsbgHFWmpQbyB9klEHr1";
  const [serviceProviders, setServiceProviders] = useState([]);
  const [selectedProviderId, setSelectedProviderId] = useState(null);
  const [selectedDate, setSelectedDate] = useState(
    moment().format("DD/MM/YYYY")
  );
  const [bookings, setBookings] = useState([]); // Initialize as an empty array
  const weekDays = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  const [selectedDay, setSelectedDay] = useState(null);

  const handleDaySelect = (day) => {
    const today = moment().format("dddd");
    const todayIndex = weekDays.indexOf(today);

    const filteredWeekDays = weekDays
      .slice(todayIndex)
      .concat(weekDays.slice(0, todayIndex));

    const currentDate = moment().add(filteredWeekDays.indexOf(day), "days");
    const formattedDate = currentDate.format("DD/MM/YYYY");

    setSelectedDate(formattedDate);
    setSelectedDay(day);
  };

  useEffect(() => {
    // Fetch service providers data from your server route
    fetch(
      `http://server.bafta.co/users/TMugCo4XGRQa8kmXEXJejTlSWUh1/serviceProviders`
    )
      .then((response) => response.json())
      .then((data) => {
        setServiceProviders(data);
      })
      .catch((error) =>
        console.error("Error fetching service providers:", error)
      );
  }, [userId]);

  useEffect(() => {
    if (selectedDate && selectedProviderId && userId) {
      // Make an HTTP request to your Express route
      fetch(
        `http://192.168.1.7:3001/fetchBooking?businessOwnerId=${userId}&selectedCalendar=${selectedDate}&serviceProviderId=${selectedProviderId}`
      )
        .then((response) => response.json())
        .then((data) => {
          const bookings = data.bookings || []; // Initialize as an empty array if data.bookings is undefined
          setBookings(bookings);
        })
        .catch((error) => console.error("Error fetching bookings:", error));
    }
  }, [selectedDate, selectedProviderId, userId]);

  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.title}>Weekdays</Text>
        <WeekdaySelector
          weekDays={weekDays}
          selectedDay={selectedDay}
          handleDaySelect={handleDaySelect}
        />
      </View>
      <Text style={styles.title}>Service Providers</Text>
      <View>
        <ServiceProvidersList
          serviceProviders={serviceProviders}
          setSelectedProviderId={setSelectedProviderId}
          selectedProviderId={selectedProviderId}
        />
      </View>
      <View>
        <Text style={styles.title}>Bookings</Text>
        {bookings !== null ? (
          bookings.length > 0 ? (
            <BookingList bookings={bookings} />
          ) : (
            <Text>
              No bookings available for the selected date and provider.
            </Text>
          )
        ) : (
          <Text>Loading...</Text>
        )}
      </View>
    </View>
  );
};

const WeekdaySelector = ({ weekDays, selectedDay, handleDaySelect }) => {
  const today = moment().format("dddd");
  const todayIndex = weekDays.indexOf(today);

  const orderedWeekdays = [
    ...weekDays.slice(todayIndex),
    ...weekDays.slice(0, todayIndex),
  ];

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      <View style={styles.weekdaySelector}>
        {orderedWeekdays.map((day, index) => {
          const currentDate = moment().add(index, "days");
          const isToday = currentDate.isSame(moment(), "day");

          return (
            <TouchableOpacity
              key={index}
              style={[
                styles.weekdayButton,
                day === selectedDay && styles.selectedDayButton,
              ]}
              onPress={() => handleDaySelect(day)}
            >
              <View style={styles.dayInfoContainer}>
                {isToday ? (
                  <Text
                    style={[
                      styles.todayText,
                      day === selectedDay && styles.selectedDayText,
                    ]}
                  >
                    Today
                  </Text>
                ) : (
                  <Text
                    style={[
                      styles.weekdayText,
                      day === selectedDay && styles.selectedDayText,
                      { marginBottom: 10, paddingTop: 6 },
                    ]}
                  >
                    {day}
                  </Text>
                )}

                <View
                  style={[
                    styles.dayOfMonthCircle,
                    selectedDay === day && styles.selectedDayCircle,
                    { marginTop: 10 },
                  ]}
                >
                  <Text
                    style={[
                      styles.dayOfMonthText,
                      selectedDay === day && styles.selectedDayText,
                    ]}
                  >
                    {currentDate.date()}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </ScrollView>
  );
};

const ServiceProvidersList = ({
  serviceProviders,
  setSelectedProviderId,
  selectedProviderId,
}) => {
  const handleProviderClick = (provider) => {
    setSelectedProviderId(provider.serviceProviderId);
  };

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      {serviceProviders.map((provider, index) => (
        <TouchableOpacity
          key={index}
          style={[
            styles.serviceProviderContainer,
            provider.serviceProviderId === selectedProviderId &&
              styles.selectedProviderContainer,
          ]}
          onPress={() => handleProviderClick(provider)}
        >
          <Image
            source={{ uri: provider.imageUrl }}
            style={styles.serviceProviderImage}
          />
          <Text style={styles.serviceProviderName}>{provider.name}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

const BookingList = ({ bookings }) => {
  return (
    <View style={styles.bookingContainer}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>Time Slot</Text>
        <Text style={styles.headerText}>Service</Text>
      </View>
      {bookings.map((item, index) => (
        <View key={index} style={styles.bookingItem}>
          <Text style={styles.bookingText}>{item.selectedTimeSlot}</Text>
          <Text style={styles.bookingText}>{item.services}</Text>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 16,
  },
  selectedProviderName: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 10,
  },
  serviceProviderContainer: {
    marginRight: 10,
    alignItems: "center",
    elevation: 2,
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 10,
  },
  selectedProviderContainer: {
    backgroundColor: "lightblue", // Add your desired background color
  },
  serviceProviderImage: {
    width: 50,
    height: 50,
    borderRadius: 8,
    marginBottom: 10,
  },
  serviceProviderName: {
    marginTop: 8,
    fontWeight: "bold",
    textAlign: "center",
  },
  bookingItem: {
    padding: 12,
    borderBottomWidth: 1,
  },
  bookingText: {
    fontSize: 16,
  },
  weekdaySelector: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  weekdayButton: {
    padding: 10,
    marginHorizontal: 10,
    borderRadius: 10,
  },
  selectedDayButton: {
    backgroundColor: "blue",
  },
  weekdayText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  selectedDayText: {
    color: "white",
  },
  dayOfMonthCircle: {
    width: 25,
    height: 25,
    borderRadius: 12,
    backgroundColor: "lightblue",
    alignItems: "center",
    justifyContent: "center",
  },
  selectedDayCircle: {
    backgroundColor: "pink",
  },
  dayOfMonthText: {
    color: "black",
    fontSize: 16,
  },
  dayInfoContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  todayText: {
    color: "lightblue",
    fontSize: 19,
    fontWeight: "bold",
    textAlign: "center",
    borderRadius: 8,
    paddingTop: 6,
    paddingBottom: 10,
  },
  bookingContainer: {
    elevation: 2,
    backgroundColor: "white",
    borderRadius: 10,
    marginTop: 10,
    padding: 10,
    marginBottom: 2,
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  headerText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  bookingItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 18,
    borderBottomWidth: 1,
  },
  bookingText: {
    fontSize: 16,
  },
});

export default MyComponent;
