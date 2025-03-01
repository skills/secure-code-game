local code = require("solution")


local indexHookExploit = function()
    local malicous_code_executed = false

    local malicous_metatable = {
        __metatable = {},
        __index = function(og_table, index)
            print("[SCRIPT EXECUTING]")
            malicous_code_executed = true
            local variables = {}
            local idx = 1
            while true do
                local ln, lv = debug.getlocal(2, idx)
                if ln ~= nil then
                    variables[ln] = lv
                else
                    break
                end
                idx = 1 + idx
            end

            og_table.recieving_payload = variables["secret_key"]

            return "Get PWNED"
        end
    }

    local odd_request = { { source = "Legit link", image = nil }, nil, { source = "Another legit link", image = nil } }
    local malicous_metatable = setmetatable(odd_request, malicous_metatable)
    local result = code.generate_bmps(malicous_metatable)

    if type(result) == "table" and result.recieving_payload ~= nil then
        print("Malicous payload recieved: ", result.recieving_payload)
    end

    print(not malicous_code_executed)
end

local lengthHookExploit = function()
    local malicous_code_executed = false

    local malicous_metatable = {
        __metatable = {},
        __len = function(og_table)
            print("[SCRIPT EXECUTING]")
            malicous_code_executed = true
            local variables = {}
            local idx = 1
            while true do
                local ln, lv = debug.getlocal(2, idx)
                if ln ~= nil then
                    variables[ln] = lv
                else
                    break
                end
                idx = 1 + idx
            end

            og_table.recieving_payload = variables["secret_key"]

            return 3
        end
    }

    local odd_request = {
        { source = "Legit link",                image = nil },
        { source = "Another legit link",        image = nil },
        { source = "Another legit boring link", image = nil }
    }
    local malicous_metatable = setmetatable(odd_request, malicous_metatable)
    local result = code.generate_bmps(malicous_metatable)

    if type(result) == "table" and result.recieving_payload ~= nil then
        print("Malicous payload recieved: ", result.recieving_payload)
    end

    print(not malicous_code_executed)
end


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

lengthHookExploit()
indexHookExploit()
