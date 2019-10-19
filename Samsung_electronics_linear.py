import math
import numpy as np
import pandas as pd
from sklearn import preprocessing, model_selection, svm
from sklearn.linear_model import LinearRegression
import codecs, json 

def Samsung_Predict(filename):
    colnames = ['Adj. Date','Adj. Open', 'Adj. High', 'Adj. Low', 'Adj. Close','Adj. Close2', 'Adj. Volume']
    df = pd.read_csv(filename,header= 0 ,names=colnames, dtype={'Adj. Open':np.float64,'Adj. High':np.float64,'Adj. Low':np.float64,'Adj. Close':np.float64,'Adj. Close2':np.float64,'Adj. Volume':np.float64 })
    

    df.dropna(axis=0, how='any', thresh=None, subset=None, inplace=False)
    df = df.dropna(how='any',axis=0) 
   

    df['HL_PCT'] = (df['Adj. High'] - df['Adj. Low']) / df['Adj. Close'] * 100.0
    df['PCT_change'] = (df['Adj. Close'] - df['Adj. Open']) / df['Adj. Open'] * 100.0

    df = df[['Adj. Close','Adj. Close2', 'HL_PCT', 'PCT_change', 'Adj. Volume']]
    forecast_col = 'Adj. Close'

    forecast_out = int(math.ceil(0.01 * len(df)))
    df['label'] = df[forecast_col].shift(-forecast_out)

    X = np.array(df.drop(['label'], 1))
    X = preprocessing.scale(X)
    X_lately = X[-forecast_out:]
    X = X[:-forecast_out]



    df.dropna(inplace=True)

    y = np.array(df['label'])

    X_train, X_test, y_train, y_test = model_selection.train_test_split(X, y, test_size=0.2)
    clf = LinearRegression(n_jobs=-1)
    clf.fit(X_train, y_train)
    confidence = clf.score(X_test, y_test)

    print(confidence)

    forecast_set = clf.predict(X_lately)
    
    return forecast_set

    

forecast_set =Samsung_Predict('Samsung_orig.csv')
np_array_to_list = forecast_set.tolist()
json_file = "predict_result.json" 
json.dump(np_array_to_list, codecs.open(json_file, 'w', encoding='utf-8'),  indent=4)

print(forecast_set)
