import sched, time
from datamaker import makeSample
from login import sqlexec

while True:
    
    
def add_sample():
    """adds a sample to the mysql database and drops a sample, simulating
    daily in/out of the LIMs database"""
    
    sample = makeSample()
    count += 1

    sampleData = sample['sampleData']
    testData = sample['testData']
    resultData = sample['resultData']

    add_sample = (
        "INSERT INTO SAMPLE "
        "(SAMPLE_NAME, SAMPLE_TYPE, STATUS, DATE_COMPLETED, LOGIN_DATE, IN_SPEC) "
        "VALUES "
        "(%(SAMPLE_NAME)s, %(SAMPLE_TYPE)s, %(STATUS)s, "
        "%(DATE_COMPLETED)s, %(LOGIN_DATE)s, %(IN_SPEC)s )"    
    )
    sqlexec(add_sample, sampleData)

    #sql exec returns MAX(SAMPLE_NUMBER as [(NUMBER,)]
    sampleData['SAMPLE_NUMBER'] = str(*sqlexec("SELECT "
                                               "MAX(SAMPLE_NUMBER) FROM SAMPLE")[0])
    testData['SAMPLE_NUMBER'] = resultData['SAMPLE_NUMBER'] = sampleData['SAMPLE_NUMBER']

    for test, spec in zip(testData['TEST_LIST'], testData['IN_SPEC']):
        add_test = (
            "INSERT INTO TEST "
            "(SAMPLE_NUMBER, TEST_LIST, IN_SPEC) VALUES ('%s', '%s', '%s')\
            " %(testData['SAMPLE_NUMBER'], test, spec)
        )
        sqlexec(add_test)

    for entry, spec in zip(resultData['ENTRY'], resultData['IN_SPEC']):
        add_result = (
            "INSERT INTO RESULT "
            "(SAMPLE_NUMBER, ENTRY, IN_SPEC) VALUES ('%s', '%s', '%s')\
            " %(testData['SAMPLE_NUMBER'], entry, spec)
        )
        sqlexec(add_result)
