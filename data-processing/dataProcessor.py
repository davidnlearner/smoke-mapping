import csv
from datetime import datetime, timedelta
import math
import json

def csvParser():
    with open('data-processing/monthly_county_data.csv', 'w', newline='') as outputfile:
        monthlyWriter = csv.writer(outputfile, delimiter=',', quotechar='"', quoting=csv.QUOTE_MINIMAL)
        with open('data/full_daily_county_data.csv', 'r', newline='') as csvfile:
            basefile = csv.reader(csvfile, delimiter=',', quotechar='"')
            count = 0
            geoId = 0
            monthValue = 0

            print("starting...")
            for row in basefile:
                count +=1
                if count == 1: 
                    monthlyWriter.writerow(row)
                    continue
                entryGeoId = int(row[0])
                stringDate = row[1]
                entryDate = datetime.strptime(stringDate[:-2], '%Y%m')
                entryValue = row[2]
                roundedValue = round_half_up(float(entryValue))

                if geoId == 0:
                    geoId = entryGeoId
                    lastDate = entryDate
                    lastDateString = stringDate[:-2]
                elif entryGeoId != geoId:
                    monthlyWriter.writerow([geoId,lastDateString, monthValue])
                    geoId = entryGeoId
                    lastDate = entryDate
                    lastDateString = stringDate[:-2]
                else:
                    if entryDate == lastDate:
                        if roundedValue > monthValue:
                            monthValue = roundedValue
                    else:
                        monthlyWriter.writerow([geoId,lastDateString, monthValue])
                        lastDate = entryDate
                        lastDateString = stringDate[:-2]
                        monthValue = roundedValue


def csvToJSONConverter():
        with open('data-processing/monthly_county_data.csv', 'r', newline='') as csvfile:
            monthlyData = csv.reader(csvfile, delimiter=',', quotechar='"')
            count = 0
            countyList = []
            countyDictionary = {}
            currentGeoId = 0
            currentIndex = 1

            for row in monthlyData:
                count += 1
                if count == 1: continue
                rowGeoId = row[0]
                rowDateString = row[1]
                rowValue = row[2]

                rowDate = datetime.strptime(rowDateString, "%Y%m")

                index = (rowDate.year - 2006) * 12 + rowDate.month

                if count == 1: 
                    continue
                if currentGeoId == 0:
                    currentGeoId = rowGeoId
                elif currentGeoId != rowGeoId:
                    countyDictionary[currentGeoId] = countyList
                    countyList = []
                    currentGeoId = rowGeoId
                    currentIndex = 1
                else:
                    while (index > currentIndex):
                        countyList.append(0)
                        currentIndex += 1
                    countyList.insert(index, rowValue)
                    currentIndex += 1
        with open("data-processing/smokeData.json", "w") as outfile:
            json.dump(countyDictionary, outfile)
            return True

def jsonValidation():
    with open("data-processing/smokeData.json", "r") as inputfile:
        dataDictionary = json.load(inputfile)

        print(len(dataDictionary["1001"]))
        print(len(dataDictionary["48009"]))
        print(len(dataDictionary["47185"]))



def findEarliestDate():
    with open('data/full_daily_county_data.csv', 'r', newline='') as csvfile:
        monthlyData = csv.reader(csvfile, delimiter=' ', quotechar='|')
        count = 0
        # earliestDate = datetime(2006, 12, 31)
        # countyCounter = 0
        # entriesFrom06 = 0

        dateDictionary = {}

        for row in monthlyData:
            count += 1
            if count == 1:
                continue
            rowList = row[0].split(',')
            entryGeoId = int(rowList[0].strip('\"'))
            stringDate = rowList[1].strip('\"')
            entryDate = datetime.strptime(stringDate, '%Y%m%d')

            if entryDate in dateDictionary:
                dateDictionary[entryDate] += 1
            else:
                dateDictionary[entryDate] = 1
        '''
            # if count == 2:
            #     # earliestDate = entryDate # earliest date
            #     geoId = entryGeoId
            #     # countyCounter += 1
            # else:
            #     # if entryDate < earliestDate:
            #     #     earliestDate = entryDate
            #     #     print(count)
            #     # if entryDate < earliestDate: # 17964 entires from 2006
            #     #     entriesFrom06 += 1
            #     if entryGeoId != geoId:  # 3108 counties
            #     #     countyCounter += 1
            #         geoId = entryGeoId

        # print(earliestDate)
        # print(f"there are {countyCounter}")
        # print(f"entires from '06 : {entriesFrom06}")
        '''
        greatest = 0
        for date in dateDictionary:
            if dateDictionary[date] > greatest:
                greatest = dateDictionary[date]
            if dateDictionary[date] > 2000:
                print(date)
        print(greatest)

def meanMedianMode():
     with open('data/full_daily_county_data.csv', 'r', newline='') as csvfile:
        monthlyData = csv.reader(csvfile, delimiter=' ', quotechar='|')
        count = 0
        sum = 0

        valueDictionary = {}
        # mean = 0 # average
        #median = 0 too much effort
        mode = 0 # most common
        greatest = 0
        smallest = 10000
        limiter = 0

        for row in monthlyData:
            if count == 0:
                count += 1
                continue
            rowList = row[0].split(',')
            entryGeoId = int(rowList[0].strip('\"'))
            stringDate = rowList[1].strip('\"')
            entryDate = datetime.strptime(stringDate[:-2], '%Y%m')
            entryValue = rowList[2]


            roundedValue = round_half_up(float(entryValue))

            if 'e' in entryValue and limiter < 10:
                print(float(entryValue))
                limiter += 1
                print(roundedValue)

            sum += roundedValue
            count += 1
            if roundedValue > greatest:
                greatest = roundedValue
            if roundedValue < smallest:
                smallest = roundedValue

            if roundedValue in valueDictionary:
                valueDictionary[roundedValue] += 1
            else:
                valueDictionary[roundedValue] = 1


        print(f"average value: {sum/count}")
        print(f"smallest value: {smallest}")
        print(f"greatest value: {greatest}")
        modeValue = 0
        over100 = 0

        for x in valueDictionary:
            if valueDictionary[x] > modeValue:
                mode = x
            if x > 100:
                over100 += valueDictionary[x]

        print(f"mode = {mode}")
        print(f"over 100: {over100}")

def round_half_up(n, decimals=3):
    multiplier = 10 ** decimals
    return math.floor(n*multiplier + 0.5) / multiplier

if __name__ == '__main__':
    # csvParser()
    # findEarliestDate()
    # meanMedianMode()
    # csvToJSONConverter()
    jsonValidation()
