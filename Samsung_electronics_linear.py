import math
import numpy as np
import pandas as pd
from sklearn import preprocessing, model_selection, svm
from sklearn.linear_model import LinearRegression
import codecs, json 

def predict_model(df,forecast_col):
    result = {'Low':[],'High':[] }

    forecast_out = int(math.ceil(0.01 * len(df)))
    df['label'] = df[forecast_col].shift(-forecast_out)

    X = np.array(df.drop(['label'], 1))
    X = preprocessing.scale(X)
    X_lately = X[-forecast_out:]
    X = X[:-forecast_out]

    df.dropna(inplace=True)

    y = np.array(df['label'])

    forecast_set = classifier_change(X,y,forecast_col,X_lately)

    return forecast_set

def classifier_change(X,y,forecast_col,X_lately):
    X_train, X_test, y_train, y_test = model_selection.train_test_split(X, y, test_size=0.2)
    clf = LinearRegression(n_jobs=-1)
    clf.fit(X_train, y_train)
    confidence = clf.score(X_test, y_test)

    if(forecast_col == 'Adj. High_x'):
        print('High value accuracy' , confidence)
    else:
        print('Low value accuracy' , confidence)

    forecast_set = clf.predict(X_lately)

    return forecast_set

def Samsung_Predict(Mainfile, Subfile):
    colnames = ['Adj. Date','Adj. Open', 'Adj. High', 'Adj. Low', 'Adj. Close','Adj. Close2', 'Adj. Volume']
    df = pd.read_csv(Mainfile,header= 0 ,names=colnames, dtype={'Adj. Open':np.float64,'Adj. High':np.float64,'Adj. Low':np.float64,'Adj. Close':np.float64,'Adj. Close2':np.float64,'Adj. Volume':np.float64 })
    dfs = pd.read_csv(Subfile,header= 0 ,names=colnames, dtype={'Adj. Open':np.float64,'Adj. High':np.float64,'Adj. Low':np.float64,'Adj. Close':np.float64,'Adj. Close2':np.float64,'Adj. Volume':np.float64 })
    

    df.dropna(axis=0, how='any', thresh=None, subset=None, inplace=False)
    df = df.dropna(how='any',axis=0) 
    dfs.dropna(axis=0, how='any', thresh=None, subset=None, inplace=False)
    dfs = df.dropna(how='any',axis=0)

    merge = pd.merge(df, dfs, on='Adj. Date', how='inner')

    df = merge[['Adj. Open_x', 'Adj. Close_x','Adj. Close2_x', 'Adj. Low_x', 'Adj. High_x', 'Adj. Volume_x','Adj. Close_y']]

    print(df.head())
    num = (df['Adj. High_x'] - df['Adj. Low_x'])
    den = (df['Adj. Close_x'])
    df['HL_PCT'] = (num / den) * 100.0

    num = (df['Adj. Close_x'] - df['Adj. Open_x'])
    den = (df['Adj. Open_x'])
    df['PCT_change'] =( num/den ) * 100.0

    df = df[['Adj. Close_x','Adj. Close_y', 'Adj. Close2_x', 'HL_PCT', 'PCT_change', 'Adj. Volume_x','Adj. Low_x','Adj. High_x']]
    forecast_col = 'Adj. High_x'
    High = predict_model(df,'Adj. High_x')
    Low = predict_model(df,'Adj. Low_x')

    return Low, High

    

Low, High =Samsung_Predict('Samsung_orig.csv', 'samsung_sd.csv')
print('Low', Low)
print('high', High)
np_array_to_list = Low.tolist()
json_file = "Low_list.json" 
json.dump(np_array_to_list, codecs.open(json_file, 'w', encoding='utf-8'),  indent=4)

np_array_to_list = High.tolist()
json_file = "High_list.json" 
json.dump(np_array_to_list, codecs.open(json_file, 'w', encoding='utf-8'),  indent=4)