CREATE OR REPLACE FUNCTION get_all_establishments_for_user(user_id INTEGER)
RETURNS SETOF public.establishment AS
$$
BEGIN
    -- Validate input
    IF user_id IS NULL THEN
        RAISE EXCEPTION 'user_id cannot be null';
    END IF;

    -- Fetch establishments and return the result set (empty if none found)
    RETURN QUERY
    SELECT
        e.id,
        e.parent_id,
        e.name::VARCHAR,
        e.description::VARCHAR,
        e.utm_zone,
        e.latitude,
        e.longitude,
        e.utm_x,
        e.utm_y,
        e.datum,
        e.long_calc,
        e.lat_calc,
        e.geom,
        e.gov_id::VARCHAR,
        e.local_id::VARCHAR,
        e.alt_id::VARCHAR,
        e.operating_permit_id::VARCHAR,
        e.facility_type::VARCHAR,
        e.naics_code::VARCHAR,
        e.nace_code::VARCHAR,
        e.sector_code::VARCHAR,
        e.industry_description::VARCHAR,
        e.capacity_mw,
        e.employees_total,
        e.contact_name::VARCHAR,
        e.contact_email::VARCHAR,
        e.contact_phone::VARCHAR,
        e.website_url::VARCHAR,
        e.program_acronym::VARCHAR,
        e.pollutant_release,
        e.usr_defined_01::VARCHAR,
        e.usr_defined_02::VARCHAR,
        e.usr_defined_03::VARCHAR,
        e.usr_defined_04::VARCHAR,
        e.usr_defined_05::VARCHAR,
        e.usr_defined_06::VARCHAR,
        e.usr_defined_07::VARCHAR,
        e.usr_defined_08::VARCHAR,
        e.usr_defined_09::VARCHAR,
        e.usr_defined_10::VARCHAR,
        e.usr_json_defined,
        e.upload::VARCHAR,
        e.created_at,
        e.updated_at,
        e.owner_id
    FROM
        public.establishment e
    WHERE
        e.owner_id = user_id
        OR EXISTS (
            SELECT 1
            FROM public.establishment_access ea
            WHERE ea.establishment_id = e.id
              AND ea.user_id = user_id
        );

    RETURN;
END;
$$ LANGUAGE plpgsql;
