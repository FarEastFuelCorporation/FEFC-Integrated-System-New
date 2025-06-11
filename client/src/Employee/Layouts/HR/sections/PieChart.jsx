import { useEffect, useState } from "react";
import { ResponsivePie } from "@nivo/pie";
import { tokens } from "../../../../theme";
import { useTheme } from "@emotion/react";
import axios from "axios";

const PieChart = () => {
  const apiUrl = process.env.REACT_APP_API_URL;
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [data, setData] = useState([]);

  const departmentLabelMap = {
    "ADMIN DEPARTMENT": "ADMIN DEPT.",
    "WAREHOUSE & RENDERING DEPARTMENT": "W&R DEPT.",
    "TREATMENT DEPARTMENT": "TREATMENT DEPT.",
    "LOGISTICS DEPARTMENT": "LOGISTICS DEPT.",
    "FACILITY MANAGEMENT SERVICES DEPARTMENT": "FMS DEPT.",
    "EXECUTIVE DEPARTMENT": "EXECUTIVE DEPT.",
    "MARKETING DEPARTMENT": "MARKETING DEPT.",
    "ENGINEERING/ RESEARCH AND DEVELOPMENT DEPARTMENT": "ERD DEPT.",
  };

  useEffect(() => {
    const fetchDepartmentCounts = async () => {
      try {
        const response = await axios.get(`${apiUrl}/api/department/count`);
        const departments = response.data.departments;

        const formattedData = departments.map((dept) => {
          const rawDept = dept.department;
          const mappedLabel =
            departmentLabelMap[rawDept] || rawDept.replace(" DEPARTMENT", "");

          return {
            id: mappedLabel,
            label: mappedLabel,
            value: dept.employeeCount,
            color: "hsl(210, 70%, 50%)",
          };
        });

        setData(formattedData);
      } catch (error) {
        console.error("Error fetching department counts:", error);
      }
    };

    fetchDepartmentCounts();
  }, [apiUrl]);

  return (
    <ResponsivePie
      data={data}
      theme={{
        axis: {
          domain: {
            line: {
              stroke: colors.grey[100],
            },
          },
          legend: {
            text: {
              fill: colors.grey[100],
            },
          },
          ticks: {
            line: {
              stroke: colors.grey[100],
              strokeWidth: 1,
            },
            text: {
              fill: colors.grey[100],
            },
          },
        },
        legends: {
          text: {
            fill: colors.grey[100],
          },
        },
        tooltip: {
          container: {
            color: colors.primary[500],
          },
        },
      }}
      margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
      innerRadius={0.5}
      padAngle={0.7}
      cornerRadius={3}
      activeOuterRadiusOffset={8}
      borderWidth={1}
      borderColor={{
        from: "color",
        modifiers: [["darker", 0.2]],
      }}
      arcLinkLabelsSkipAngle={0}
      arcLinkLabelsTextColor={colors.grey[100]}
      arcLinkLabelsThickness={2}
      arcLinkLabelsColor={{ from: "color" }}
      arcLabelsSkipAngle={10}
      arcLabelsTextColor={{
        from: "color",
        modifiers: [["darker", 2]],
      }}
      defs={[
        {
          id: "dots",
          type: "patternDots",
          background: "inherit",
          color: "rgba(255, 255, 255, 0.3)",
          size: 4,
          padding: 1,
          stagger: true,
        },
        {
          id: "lines",
          type: "patternLines",
          background: "inherit",
          color: "rgba(255, 255, 255, 0.3)",
          rotation: -45,
          lineWidth: 6,
          spacing: 10,
        },
      ]}
      legends={[
        {
          anchor: "bottom",
          direction: "row",
          justify: false,
          translateX: 0,
          translateY: 56,
          itemsSpacing: 0,
          itemWidth: 100,
          itemHeight: 18,
          itemTextColor: "#999",
          itemDirection: "left-to-right",
          itemOpacity: 1,
          symbolSize: 18,
          symbolShape: "circle",
          effects: [
            {
              on: "hover",
              style: {
                itemTextColor: "#000",
              },
            },
          ],
          legendOffset: 10,
        },
      ]}
    />
  );
};

export default PieChart;
