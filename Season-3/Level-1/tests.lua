-- This file contains passing tests.

-- Run them by opening a terminal and running the following:
-- $ (cd Season-3/Level-1/ && lua tests.lua)

local code = require("code")

local does_it_return_cats = function()
    local our_normal_request = {
        { source = "Legit link",                image = nil },
        { source = "Another legit link",        image = nil },
        { source = "Another legit boring link", image = nil }
    }

    local expected_result = {
        { source = "Legit link",                image = "Cat pictures" },
        { source = "Another legit link",        image = "Cat pictures" },
        { source = "Another legit boring link", image = "Cat pictures" }
    }

    local result = code.generate_bmps(our_normal_request)

    local isValid = true


    for key, value in pairs(result) do
        if not (value.source == expected_result[key].source and value.image == expected_result[key].image) then
            isValid = false
        end
    end

    print(isValid)
end

local does_it_hanlde_malformed_requests = function()
    local our_normal_request = {
        { source = "Legit link",        image = nil },
        { source = 1,                   image = nil },
        { source = "legit boring link", image = nil }
    }

    local expected_result = {
        { source = "Legit link",        image = "Cat pictures" },
        { source = "Bad request",       image = "Error Image" },
        { source = "legit boring link", image = "Cat pictures" }
    }

    local result = code.generate_bmps(our_normal_request)

    local isValid = true


    for key, value in pairs(result) do
        if not (value.source == expected_result[key].source and value.image == expected_result[key].image) then
            isValid = false
        end
    end

    print(isValid)
end

does_it_return_cats()
does_it_hanlde_malformed_requests()
