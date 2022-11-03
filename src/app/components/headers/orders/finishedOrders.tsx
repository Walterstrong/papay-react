import React from "react";
import TabPanel from "@mui/lab/TabPanel";
import { Box, Stack, Container } from "@mui/material";
import Button from "@mui/material/Button";
import { borderRadius } from "@mui/system";

const finishedOrders = [
  [1, 2, 3],
  [1, 2, 3],
  [1, 2, 3],
];

export default function FinishedOrders(props: any) {
  return (
    <TabPanel value="3">
      <Stack>
        {finishedOrders?.map((order) => {
          return (
            <Box className="order_main_box">
              <Box className="order_box_scroll">
                {order.map((item) => {
                  const image_path = "/restaurant/top5.jpg";
                  return (
                    <Box className="ordersName_price">
                      <img src={image_path} className="orderDishImg" />
                      <p className="titleDish">Qovurm lag'mon yangisi</p>
                      <Box className="priceBox">
                        <p> $12</p>
                        <img src="/icons/Close.svg" />
                        <p style={{ marginLeft: "25px" }}>2</p>
                        <img src="/icons/Pause.svg" />
                        <p style={{ marginLeft: "25px" }}>$24</p>
                      </Box>
                    </Box>
                  );
                })}
              </Box>
              <Box className="total_price_box_gray">
                <Box className="boxTotal">
                  <p>
                    <u> mahsulot narxi </u>
                  </p>
                  <p>$24</p>
                  <img src="/icons/Plus.svg" style={{ marginLeft: "20px" }} />
                  <p>
                    <u>Yetkazib xizmati</u>
                  </p>
                  <p>$24</p>
                  <img src="/icons/Pause.svg" style={{ marginLeft: "20px" }} />
                  <p>
                    <u>jami narx</u>
                  </p>
                  <p>$24</p>
                  <Button
                    variant="contained"
                    color="secondary"
                    size="small"
                    style={{ borderRadius: "10px", marginLeft: "15px" }}
                  >
                    bekor qo'lish
                  </Button>
                  <Button
                    variant="contained"
                    color="primary"
                    size="small"
                    style={{ borderRadius: "10px", marginLeft: "10px" }}
                  >
                    to'lash
                  </Button>
                </Box>
              </Box>
            </Box>
          );
        })}
      </Stack>
    </TabPanel>
  );
}
