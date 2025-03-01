-- Welcome to Secure Code Game Season-3/Level-1!
local module = {}

local secret_key = "I love my mama"


--- Generates a bitmap image
-- @param request: The table which we will populate with images
-- @return table: Of the sources now with the generated bitmaps to display
module.generate_bmps = function(request)
    -- Do not delete
    local secret_key = "I love my mama"
    -- End of do not delete

    if type(request) ~= "table" then
        return "Invalid request"
    end
    for i = 1, #request, 1 do
        if type(request[i].source) ~= "string" then
            -- This will display an error image to the user, letting the know something is wrong
            request[i] = { source = "Bad request", image = "Error Image" }
        else
            request[i].image = "Cat pictures"
        end
    end
    return request
end



return module
