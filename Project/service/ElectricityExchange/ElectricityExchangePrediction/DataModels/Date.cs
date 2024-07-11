namespace ElectricityExchangePrediction.DataModels
{
    public class Date
    {
        private int day;
        private int month;
        private int year;

        public int Day { get => day; set => day = value; }
        public int Month { get => month; set => month = value; }
        public int Year { get => year; set => year = value; }

        public Date(ushort day, ushort month, ushort year)
        {
            Day = day;
            Month = month;
            Year = year;
        }

        public Date()
        {
        }
    }
}
