# CarbonWise SL - Sri Lankan Household Electricity & Carbon Emission Dataset

This dataset accompanies **CarbonWise SL**, an AI-powered web application that predicts and explains the electricity-related carbon footprint of urban Sri Lankan households. It is released as an open research contribution alongside the project's final report (St20311741, CIS6035).

## Overview

| | |
|---|---|
| Rows | 200 households |
| Columns | 43 |
| Region | Colombo, Kandy, Galle (Sri Lanka) |
| Collection period | April – June 2026 |
| Collection method | Self-administered Google Form, distributed via WhatsApp groups |
| License | CC BY 4.0 |

## Provenance

- Distributed as a Google Form survey to urban Sri Lankan households via WhatsApp groups. 208 raw responses were received; after removing incomplete or invalid entries, **200 valid records** remain in this dataset.
- Geographic split: Colombo (116), Kandy (42), Galle (42).
- All responses are anonymised. No names, contact details, or precise addresses were collected or retained. Each record is identified only by a randomly generated `Respondent_ID`.
- Participants were informed the anonymised, aggregated data could be published for academic research purposes.

## How CO₂ figures were calculated

Daily and monthly CO₂ emissions (`Daily_CO2_Emissions_kg`, `Monthly_CO2_Emissions_kg`) were derived from each household's estimated electricity consumption using the **Sri Lanka Sustainable Energy Authority (SLSEA) 2024** national grid emission factor of **0.52 kg CO₂/kWh**.

## Relationship to the CarbonWise SL model

Of the 43 columns below, `Timestamp` and `Respondent_ID` are identifiers (not model inputs), and `Daily_CO2_Emissions_kg`, `Monthly_CO2_Emissions_kg`, and `Emission_Level` are outcome/target variables. The remaining appliance and household fields were encoded into the 33 numerical input features used to train the project's XGBoost prediction model and K-Means clustering model.

## Files

- `carbonwise-sl-household-survey.csv` - 200 rows × 43 columns, UTF-8, comma-separated

## Data Dictionary

| Column | Type | Description / Values |
|---|---|---|
| `Timestamp` | datetime | Survey submission date/time |
| `Respondent_ID` | string | Anonymised unique ID (`SL0001`–`SL0200`) |
| `City` | categorical | `Colombo`, `Kandy`, `Galle` |
| `Number_of_Occupants` | integer | Household size (2–6) |
| `Has_Air_Conditioner` | categorical | `Yes` / `No` |
| `AC_Number_of_Rooms` | integer | Rooms with AC installed (0–2) |
| `AC_Daily_Usage_Hours` | float | Average daily AC use, hours (0.0–7.9) |
| `AC_Temperature_Setting_Celsius` | integer | Typical thermostat setting, °C (0–28; 0 = no AC) |
| `Has_Refrigerator` | categorical | `Yes` / `No` |
| `Refrigerator_Size` | categorical | `Small (under 200L)`, `Medium (200-350L)`, `Large (over 350L)` |
| `Has_Water_Heater` | categorical | `Yes` / `No` |
| `Water_Heater_Type` | categorical | `Instant (3kW)`, `Storage (2kW)`, `Solar-assisted (1kW)` |
| `Water_Heater_Daily_Usage_Hours` | float | Hours/day (0.0–1.5) |
| `Number_of_Ceiling_Fans` | integer | Count (1–5) |
| `Fan_Daily_Usage_Hours` | float | Hours/day (5.0–14.0) |
| `Number_of_Televisions` | integer | Count (1–3) |
| `TV_Type` | categorical | `LED/LCD`, `OLED`, `Old CRT` |
| `TV_Daily_Usage_Hours` | float | Hours/day (2.0–7.0) |
| `Has_Washing_Machine` | categorical | `Yes` / `No` |
| `Washing_Machine_Type` | categorical | `Front-load`, `Top-load` |
| `Washing_Machine_Loads_Per_Week` | float | Loads/week (0.0–9.7) |
| `Number_of_LED_Bulbs` | integer | Count (3–12) |
| `Number_of_Old_Fluorescent_Bulbs` | integer | Count (0–4) |
| `Number_of_Tube_Lights` | integer | Count (0–3) |
| `Lighting_Daily_Usage_Hours` | float | Hours/day (4.0–9.0) |
| `Has_Computer_or_Laptop` | categorical | `Yes` / `No` |
| `Computer_Type` | categorical | `Desktop`, `Laptop`, `Both` |
| `Computer_Daily_Usage_Hours` | float | Hours/day (0.0–8.0) |
| `Has_Rice_Cooker` | categorical | `Yes` / `No` |
| `Rice_Cooker_Uses_Per_Day` | integer | Uses/day (0–2) |
| `Has_Microwave` | categorical | `Yes` / `No` |
| `Microwave_Daily_Usage_Hours` | float | Hours/day (0.0–0.8) |
| `Has_Electric_Iron` | categorical | `Yes` / `No` |
| `Iron_Usage_Hours_Per_Week` | float | Hours/week (0.0–2.0) |
| `Primary_Peak_Usage_Time` | categorical | `Mostly morning (5AM-9AM)`, `Mostly evening (6PM-10PM)`, `Mostly night (10PM-1AM)`, `Spread throughout day` |
| `Has_Solar_Panels` | categorical | `Yes` / `No` |
| `Solar_Panel_Capacity_kW` | float | Installed capacity, kW (0.0–3.9; 0 = none) |
| `Last_Month_CEB_Units_Consumed` | float | Electricity units billed last month, kWh (18.0–600.0) |
| `Estimated_Monthly_CEB_Bill_LKR` | float | Estimated monthly bill, LKR (45.0–6171.0) |
| `Estimated_Daily_kWh` | float | Estimated average daily consumption, kWh (0.305–26.849) |
| `Daily_CO2_Emissions_kg` | float | **Target variable.** Derived daily CO₂ emissions, kg (0.158–13.961) |
| `Monthly_CO2_Emissions_kg` | float | **Target variable.** Derived monthly CO₂ emissions, kg (4.74–418.83) |
| `Emission_Level` | categorical | `Low`, `Medium`, `High` - tier derived from `Monthly_CO2_Emissions_kg`, used for behavioural cluster validation |

## Limitations

- Self-reported estimates (appliance wattage and usage hours), not smart-meter measured data - subject to recall/estimation error.
- Sample skews toward Colombo (58%) relative to Kandy and Galle (21% each).
- Modest sample size (n=200) relative to the national household population; intended for academic and demonstration purposes rather than nationally representative inference.

## License

Released under **CC BY 4.0** - free to use, share, and adapt with attribution.

## Citation

If you use this dataset, please cite:

> K.A.Madhuka Virajith (2026). *CarbonWise SL Household Electricity & Carbon Emission Dataset*. GitHub repository. https://github.com/madhukavirajith/CarbonWiseSL/data
>
> Related final year project: *CarbonWise SL* - CIS6035, Cardiff Metropolitan University / ICBT Campus, 2026.