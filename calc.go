package main

import (
	"encoding/json"
	"encoding/xml"
	"fmt"
	"io/ioutil"
	"net/http"
	"os"
	"strings"

	"github.com/gin-contrib/cors"

	"github.com/gin-gonic/gin"
)

type Calculator struct {
	XMLName    xml.Name    `xml:"calculator"`
	Operations []Operation `xml:"operation"`
}

type Operation struct {
	Name       string      `xml:"name,attr"`
	Parameters []Parameter `xml:"parameter"`
	Result     string      `xml:"result"`
}

type Parameter struct {
	Name  string `xml:"name,attr"`
	Value string `xml:",chardata"`
}
type Body struct {
	// json tag to de-serialize json body
	Name string `json:"name"`
}

func enableCors(w *http.ResponseWriter) {
	(*w).Header().Set("Access-Control-Allow-Origin", "*")
}

func main() {
	// read the XML file
	file, err := os.Open("calculator.xml")
	if err != nil {
		fmt.Println(err)
		return
	}
	defer file.Close()

	// read the file content
	bytes, err := ioutil.ReadAll(file)
	if err != nil {
		fmt.Println(err)
		return
	}

	// unmarshal the XML data
	var calculator Calculator
	err = xml.Unmarshal(bytes, &calculator)
	if err != nil {
		fmt.Println(err)
		return
	}

	// initialize the Gin router
	router := gin.Default()
	router.Use(cors.Default())

	// serve the index.html file
	router.GET("/", func(c *gin.Context) {
		c.File("index.html")
	})

	// serve the calculator data as JSON
	router.GET("/calculator", func(c *gin.Context) {
		c.JSON(http.StatusOK, calculator)
	})

	// handle form submission to update the calculator data
	router.POST("/calculator", func(c *gin.Context) {

		body := Calculator{}
		// using BindJson method to serialize body with struct
		if err := c.BindJSON(&body); err != nil {
			c.AbortWithError(http.StatusBadRequest, err)
			return
		}
		fmt.Println(body)
		c.JSON(http.StatusAccepted, &body)
		bI, err := xml.MarshalIndent(body, "", "   ")
		if err != nil {
			panic(err)
		}
		_ = ioutil.WriteFile("notes1.xml", bI, 0644)

		data, err := c.GetRawData()
		if err != nil {
			c.AbortWithError(http.StatusBadRequest, err)
			return
		}

		// unmarshal the form data as JSON
		var jsonData map[string]interface{}
		err = json.Unmarshal(data, &jsonData)
		if err != nil {
			c.AbortWithError(http.StatusBadRequest, err)
			return
		}

		// update the calculator data with the new values
		for key, value := range jsonData {
			keys := strings.Split(key, ".")
			if len(keys) != 3 {
				continue
			}

			for i := range calculator.Operations {
				if calculator.Operations[i].Name == keys[0] {
					for j := range calculator.Operations[i].Parameters {
						if calculator.Operations[i].Parameters[j].Name == keys[1] {
							calculator.Operations[i].Parameters[j].Value = fmt.Sprintf("%v", value)
						}
					}
				}
			}
		}

		// marshal the updated calculator data as XML
		output, err := xml.MarshalIndent(calculator, "", "  ")
		if err != nil {
			c.AbortWithError(http.StatusInternalServerError, err)
			return
		}

		// write the updated XML data back to the file
		err = ioutil.WriteFile("calculator.xml", output, 0644)
		if err != nil {
			c.AbortWithError(http.StatusInternalServerError, err)
			return
		}

		c.Status(http.StatusOK)
	})

	// start the Gin server
	router.Run(":8080")
}
