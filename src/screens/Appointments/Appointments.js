import React, { useEffect, useState } from "react";
import {
  View,
  ScrollView,
  TouchableOpacity,
  Text,
  Image,
  StyleSheet,
  RefreshControl,
} from "react-native";
import moment from "moment";
import COLORS from "../../consts/colors";
import LoadingComponent from "../../components/LoadingComponent";
import Icon from "react-native-vector-icons/FontAwesome"; // Replace with the actual icon library you are using
import haircutIcon from "../../assets/Barbershop_assets/haircut.png";
import haircolorIcon from "../../assets/Barbershop_assets/haircolor.png";
import { useSelector } from "react-redux";
const MyComponent = () => {
  const userId = useSelector((state) => state.user.userId);
  const [serviceProviders, setServiceProviders] = useState([]);
  const [selectedProviderId, setSelectedProviderId] = useState(null);
  const [selectedDate, setSelectedDate] = useState(
    moment().format("DD/MM/YYYY")
  );
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const weekDays = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  const [selectedDay, setSelectedDay] = useState(moment().format("dddd"));

  useEffect(() => {
    // Simulate data fetching or any other loading process
    setTimeout(() => {
      setIsLoading(false); // Set isLoading to false when loading is complete
    }, 3000); // Simulate a 3-second loading time
  }, []);
  useEffect(() => {
    fetchServiceProviders();
  }, [userId]);

  useEffect(() => {
    fetchBookings();
  }, [selectedDate, selectedProviderId, userId]);

  const handleDaySelect = (day) => {
    setSelectedDay(day);
    const today = moment().format("dddd");
    const todayIndex = weekDays.indexOf(today);

    const filteredWeekDays = weekDays
      .slice(todayIndex)
      .concat(weekDays.slice(0, todayIndex));

    const currentDate = moment().add(filteredWeekDays.indexOf(day), "days");
    const formattedDate = currentDate.format("DD/MM/YYYY");

    setSelectedDate(formattedDate);
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchServiceProviders();
    fetchBookings();
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

        if (data.length > 0) {
          setSelectedProviderId(data[0].serviceProviderId);
        }
      })
      .catch((error) =>
        console.error("Error fetching service providers:", error)
      );
  };

  const fetchBookings = () => {
    if (selectedDate && selectedProviderId && userId) {
      fetch(
        `http://192.168.0.8:3001/fetchBooking?businessOwnerId=${userId}&selectedCalendar=${selectedDate}&serviceProviderId=${selectedProviderId}`
      )
        .then((response) => response.json())
        .then((data) => {
          const bookings = data.bookings || [];
          setBookings(bookings);
        })
        .catch((error) => console.error("Error fetching bookings:", error));
    }
  };

  return (
    <View style={styles.container}>
      {isLoading ? (
        <LoadingComponent /> // Display the loading screen while isLoading is true
      ) : (
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
            <ServiceProvidersList
              serviceProviders={serviceProviders}
              setSelectedProviderId={setSelectedProviderId}
              selectedProviderId={selectedProviderId}
            />
            <Text style={styles.title}>
              <Text style={styles.bookOnText}>
                {selectedDay === moment().format("dddd")
                  ? "Today's "
                  : selectedDay}
              </Text>
              <Text style={styles.titleText}> - Bookings </Text>
            </Text>

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
      )}
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
          const isSelected =
            day === selectedDay || (isToday && selectedDay === null);

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
                      isSelected && styles.selectedDayNumber,
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
  const sortedBookings = [...bookings].sort((a, b) => {
    const timeSlotA = a.selectedTimeSlot;
    const timeSlotB = b.selectedTimeSlot;
    return timeSlotA.localeCompare(timeSlotB);
  });
  const serviceToImage = {
    Hair_Cut: haircutIcon,
    Hair_color: haircolorIcon, // Replace with the actual icon names
    // Add more service types and corresponding icons here
  };
  return (
    <View style={styles.bookingContainer}>
      {sortedBookings.map((item, index) => (
        <View key={index} style={styles.bookingItem}>
          <Text style={styles.bookingText}>{item.selectedTimeSlot}</Text>
          <View style={styles.iconContainer}>
            {serviceToImage[item.services] ? (
              <Image
                source={serviceToImage[item.services]} // Use the custom image asset
                style={{ width: 20, height: 20 }} // Add a custom style if needed
              />
            ) : (
              <Text>{item.services}</Text>
            )}
          </View>
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
    textAlign: "center", // Center the text horizontally
  },
  titleText: {
    color: COLORS.primary, // Use your preferred color
  },
  bookOnText: {
    color: COLORS.orange, // Use your preferred color
    fontSize: 24, // Adjust the font size
    marginLeft: 5, // Add spacing between "Bookon on" and the selected day
  },
  selectedProviderName: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 10,
  },
  serviceProviderContainer: {
    marginTop: 20,
    elevation: 2,
    backgroundColor: COLORS.white,
    borderRadius: 10,
    padding: 5,
    marginBottom: 0,
    height: 105, //service provider container height
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
  },
  bookingText: {
    fontSize: 16,
  },
  weekdaySelector: {
    flexDirection: "row",
    alignItems: "center",
    elevation: 2,
    backgroundColor: COLORS.white,
    borderRadius: 10,
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
    color: COLORS.white,
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
    backgroundColor: COLORS.white,
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
    elevation: 2, // Add a subtle shadow effect
    backgroundColor: COLORS.white, // Add a background color if needed
    borderRadius: 10, // Customize border radius
    marginTop: 10,
    padding: 10,
    marginBottom: 2,
  },
  selectedDayNumber: {
    color: COLORS.primary,
  },
  iconContainer: {
    marginRight: 10, // Add any spacing or styling you prefer
  },
});

export default MyComponent;
