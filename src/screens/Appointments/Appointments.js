import React, { useEffect, useState } from "react";
import {
  View,
  ScrollView,
  TouchableOpacity,
  Text,
  Image,
  StyleSheet,
  FlatList,
  RefreshControl,
} from "react-native";
import { Colors } from "react-native/Libraries/NewAppScreen";
import moment from "moment";
import COLORS from "../../consts/colors";

const MyComponent = () => {
  const userId = "5EvMBnwPpsbgHFWmpQbyB9klEHr1";
  const [serviceProviders, setServiceProviders] = useState([]);
  const [selectedProviderId, setSelectedProviderId] = useState(null);
  const [selectedDate, setSelectedDate] = useState(
    moment().format("DD/MM/YYYY")
  );
  const [bookings, setBookings] = useState([]);
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
  const [refreshing, setRefreshing] = useState(false);

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

  const onRefresh = () => {
    setRefreshing(true);

    // Replace this with your data fetching logic
    fetchServiceProviders();
    fetchBookings();

    // Simulate refreshing for 1 second
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const fetchServiceProviders = () => {
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
  };

  const fetchBookings = () => {
    if (selectedDate && selectedProviderId && userId) {
      fetch(
        `http://192.168.1.7:3001/fetchBooking?businessOwnerId=${userId}&selectedCalendar=${selectedDate}&serviceProviderId=${selectedProviderId}`
      )
        .then((response) => response.json())
        .then((data) => {
          const bookings = data.bookings || [];
          setBookings(bookings);
        })
        .catch((error) => console.error("Error fetching bookings:", error));
    }
  };

  useEffect(() => {
    fetchServiceProviders();
  }, [userId]);

  useEffect(() => {
    fetchBookings();
  }, [selectedDate, selectedProviderId, userId]);

  return (
    <View style={styles.container}>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View>
          <WeekdaySelector
            weekDays={weekDays}
            selectedDay={selectedDay}
            handleDaySelect={handleDaySelect}
          />
        </View>

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
      </ScrollView>
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
          const isSelected = day === selectedDay;

          return (
            <TouchableOpacity
              key={index}
              style={[
                styles.weekdayButton,
                isSelected && styles.selectedDayButton,
              ]}
              onPress={() => handleDaySelect(day)}
            >
              <View style={styles.dayInfoContainer}>
                {isToday ? (
                  <Text
                    style={[
                      styles.todayText,
                      isSelected && styles.selectedDayText,
                    ]}
                  >
                    Today
                  </Text>
                ) : (
                  <Text
                    style={[
                      styles.weekdayText,
                      isSelected && styles.selectedDayText,
                      { marginBottom: 10, paddingTop: 6 },
                    ]}
                  >
                    {day}
                  </Text>
                )}
                <View
                  style={[
                    styles.dayOfMonthCircle,
                    isSelected && styles.selectedDayCircle,
                    { marginTop: 10 },
                  ]}
                >
                  <Text
                    style={[
                      styles.dayOfMonthText,
                      isSelected && styles.selectedDayNumber, // Apply green color to the selected day number
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
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.serviceProviderContainer}
    >
      {serviceProviders.map((provider, index) => (
        <TouchableOpacity
          key={index}
          style={[
            styles.serviceProviderItem,
            provider.serviceProviderId === selectedProviderId &&
              styles.selectedProviderContainer,
          ]}
          onPress={() => handleProviderClick(provider)}
        >
          <Image
            source={{ uri: provider.imageUrl }}
            style={styles.serviceProviderImage}
          />
          <Text
            style={[
              styles.serviceProviderName,
              provider.serviceProviderId === selectedProviderId &&
                styles.selectedProviderName,
            ]}
          >
            {provider.name}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

const BookingList = ({ bookings }) => {
  return (
    <View style={styles.bookingContainer}>
      <View style={styles.headerContainer}>
        <Text style={styles.timeSlot}>Time Slot</Text>
        <Text style={styles.service}>Service</Text>
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
    marginTop: 20,

    elevation: 2, // Add a subtle shadow effect
    backgroundColor: COLORS.white, // Add a background color if needed
    borderRadius: 10, // Customize border radius
    padding: 5, // Add padding to the group
    marginBottom: 0,
  },
  serviceProviderItem: {
    marginRight: 10,
    alignItems: "center",
    elevation: 2,
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 10,
  },
  serviceProvidersContainer: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 16,
  },
  selectedProviderContainer: {
    backgroundColor: COLORS.primary,
  },
  serviceProviderImage: {
    width: 60,
    height: 60,
    backgroundColor: COLORS.primary,
    borderRadius: 8,
  },
  serviceProviderName: {
    marginTop: 8,
    fontWeight: "bold",
    textAlign: "center",
  },
  selectedProviderName: {
    color: COLORS.white,
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
    alignItems: "center",
    elevation: 2, // Add a subtle shadow effect
    backgroundColor: COLORS.white,
    borderRadius: 10, // Customize border radius
    marginBottom: 10,
  },
  weekdayButton: {
    padding: 10,
    marginHorizontal: 10,
    borderRadius: 10,
  },
  selectedDayButton: {
    backgroundColor: COLORS.primary,
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
    backgroundColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  selectedDayCircle: {
    backgroundColor: Colors.white,
  },
  dayOfMonthText: {
    color: COLORS.white,
    fontSize: 16,
  },
  dayInfoContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  todayText: {
    color: COLORS.primary,
    fontSize: 16,
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
  timeSlot: {
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 10,
  },
  service: {
    marginRight: 20,
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
  selectedDayNumber: {
    color: COLORS.primary, // Apply green color to the selected day number
  },
});

export default MyComponent;
